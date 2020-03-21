const baseURL = 'http://ep.ebmtech.com:9006/';

var AID = '2f11d3bb-e65c-41b4-9f77-6a524aa50618';
localStorage.setItem('AID', AID); // store forerver

var AID = localStorage.getItem('AID');
// var AID = sessionStorage.getItem("AID");
const token = localStorage.getItem('token');
const authorizationToken = `Bearer ${token}`;
let patientInfoAPI = {};
let patientInfo = {};
let admissionStatus = {};
let nisTopRecords = {};
const report = new Map();
createReportLink(report);

loadPatientInfo();
loadAdmissionStatus();

function loadPatientInfo() {
  const complatedURL = `${baseURL}api/PatientInfoR?id=${AID}`;
  patientInfoAPI = $.ajax({
    url: complatedURL,
    dataType: 'json',
    type: 'GET',
    beforeSend(request) {
      request.setRequestHeader('Authorization', authorizationToken);
    },
    success(response) {
      patientInfo = response;
    },
    error(err) {
      console.log('request PatientInfo fail.');
    },
  });
}

function loadAdmissionStatus() {
  const complatedURL = `${baseURL}api/AdmissionStatus`;
  $.ajax({
    url: complatedURL,
    dataType: 'json',
    type: 'GET',
    beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', authorizationToken);
    },
    success(response) {
      admissionStatus = findAdmissionStatus(response); // get this AID admissionStatus
      if (admissionStatus != null) {
        loadNisTopRecord(admissionStatus.InHosDate);
      }
    },
    error(err) {
      console.log('request AdmissionStatus fail.');
    },
  });
}

function findAdmissionStatus(allAdmissionStatus) {
  for (i = 0; i < allAdmissionStatus.length; i++) {
    if (allAdmissionStatus[i].AID == AID) {
      return allAdmissionStatus[i];
    }
  }
  return null;
}

function loadNisTopRecord(InHosDate) {
  const complatedURL = `${baseURL}api/NISTPR?id=${AID}&startDate=${InHosDate}`;
  $.ajax({
    url: complatedURL,
    dataType: 'json',
    type: 'GET',
    beforeSend(request) {
      request.setRequestHeader('Authorization', authorizationToken);
    },
    success(response) {
      nisTopRecords = response;
    },
    error(err) {
      console.log('request NISTPR fail.');
    },
  });
}

$(document).ajaxStop(() => {
  $('#loading-progress').hide();
  showPatientInfoTableHead();
  // AID corresponding patient info could not be found
  (patientInfoAPI.status == 200) ? showPatientInfoTableData() : $('#patient-info').append('<tr><td colspan="11">尚無資料。</td><tr>');
});

function showPatientInfoTableHead() {
  $('#patient-info').append(
    '<tr>'
        + '<th>病患姓名</th>'
        + '<th>身分證號</th>'
        + '<th>病例號</th>'
        + '<th>院所代號</th>'
        + '<th>出生日</th>'
        + '<th>性別</th>'
        // from admissionStatus API
        + '<th>AID</th>'
        + '<th>開始日期</th>'
        + '<th>問題註記</th>'
        + '<th>重大傷病</th>'
        + '<th>過敏記錄</th>'
        + '<th>特殊註記</th>'
        + '<th>註記</th>'
        + '<th>檢驗名稱</th>'
        + '<th>數值</th>'
        + '<th>檢驗時間</th>'
        + '<th>報告</th>'
        + '</tr>',
  );
}

function showPatientInfoTableData() {
  const info = generateInfo();
  const infoKeys = Object.keys(info);
  $('#patient-info').append('<tr></tr>');
  for (i = 0; i < infoKeys.length; i++) {
    $('#patient-info tr:last-child').append(
      `<td>${info[infoKeys[i]]}</td>`,
    );
  }
}

function generateInfo() {
  const info = {};

  info.CNM = patientInfo.CNM;
  info.IDNO = patientInfo.IDNO;
  info.CHTNO = patientInfo.CHTNO;
  info.HOSID = patientInfo.HOSID;
  info.BRNDAT = patientInfo.HOSID;
  info.GENDER = (patientInfo.Gender == 0) ? '男' : '女';

  info.AID = (admissionStatus != null) ? admissionStatus.AID : '無';
  info.InHosDate = (admissionStatus != null) ? admissionStatus.InHosDate : '無';
  info.ProblemNotes = (admissionStatus != null) ? interpretJsonString(admissionStatus.ProblemNotes) : '無';
  info.CatastrophicIllness = (admissionStatus != null) ? interpretJsonString(admissionStatus.CatastrophicIllness) : '無';
  info.Allergy = (admissionStatus != null) ? interpretJsonString(admissionStatus.Allergy) : '無';
  info.SpecialNotes = (admissionStatus != null) ? interpretJsonString(admissionStatus.SpecialNotes) : '無';
  info.Notes = (admissionStatus != null) ? interpretJsonString(admissionStatus.Notes) : '無';

  info.Item = '';
  if (!jQuery.isEmptyObject(nisTopRecords)) {
    for (i = 0; i < nisTopRecords.length; i++) {
      info.Item += `<div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${nisTopRecords[i].Item}</div>`;
      info.Value += `<div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${nisTopRecords[i].Value}`;
      info.DateTime += `<div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">${nisTopRecords[i].DateTime}`;
    }
  } else {
    info.Item = '無';
    info.Value = '無';
    info.DateTime = '無';
  }

  info.Report = '';

  for (const reportText of report.keys()) {
    info.Report += `<div style="white-space:nowrap; margin: 0.5rem 0 0.5rem 0;"><a class="report-link" href="#" tag="${report.get(reportText)}">${reportText}</a></div>`;
  }
  detectReportLinkClicked();
  console.log(JSON.parse(admissionStatus.ProblemNotes)[0].LIST_TIME);
  console.log(info);
  return info;
}

function interpretJsonString(jsonString) {
  const jsonObject = JSON.parse(jsonString);
  let result = '';
  for (i = 0; i < jsonObject.length; i++) {
    const subObject = jsonObject[i];
    const subObjectKeys = Object.keys(subObject);
    result += '<div style="margin-top: 1rem; margin-bottom: 1rem;">';
    for (j = 0; j < subObjectKeys.length; j++) {
      result += `<span>${interpretKeyName(subObjectKeys[j])}</span>`
                + `<span>${subObject[subObjectKeys[j]]}</span>`
                + '<br>';
    }
    result += '</div>';
  }
  return result;
}

function interpretKeyName(key) {
  switch (key) {
    case 'LIST_DATE':
      return '日期: ';
    case 'LIST_TIME':
      return '時間: ';
    case 'LIST_DOCTOR_NO':
      return '醫師編號: ';
    case 'PROBLEM_DESC':
      return '問題描述: ';
    case 'LIST_DIV_NO':
      return '區分編號: ';
    case 'START_DATE':
      return '開始日期: ';
    case 'END_DATE':
      return '結束日期: ';
    case 'DISEASE_NAME':
      return '疾病名稱: ';
    case 'CREATE_DATE':
      return '紀錄日期: ';
    case 'CREATE_TIME':
      return '紀錄時間: ';
    case 'ADVERSE_REACTION':
      return '不良反應: ';
    case 'REC_CLERK':
      return '紀錄人員: ';
    case 'REMARK_DESC':
      return '備註描述: ';
    default:
      return `${key}: `;
  }
}

function createReportLink(report) {
  report.set('查房首頁', 'Ad001');
  report.set('住院病患資訊', 'Ad002');
  report.set('住院診斷', 'Ad003');
  report.set('檢驗報告', 'Ad004');
  report.set('DDC報告', 'Ad005');
  report.set('病理報告', 'Ad006');
  report.set('檢查報告', 'Ad007');
  report.set('生理報告', 'Ad008');
  report.set('住院醫囑長期醫令', 'Ad009');
  report.set('住院醫囑即時醫令', 'Ad010');
  report.set('病歷摘要入院病摘', 'Ad011');
  report.set('病歷摘要住院病摘', 'Ad012');
  report.set('病歷摘要出院病摘', 'Ad013');
  report.set('放射科報告', 'Ad014');
  report.set('會診紀錄', 'Ad015');
  report.set('歷史就醫紀錄', 'Ad016');
}


function detectReportLinkClicked() {
  $('#patient-info').on('click', 'a[class=report-link]', (e) => {
    // alert($(e.target).attr('tag'));
    location.href = `report.html?AID=${AID}&tempCode=${$(e.target).attr('tag')}`;
  });
}
