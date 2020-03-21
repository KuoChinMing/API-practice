
const baseURL = 'http://ep.ebmtech.com:9006/api/';
const token = localStorage.getItem('token');
const authorizationToken = `bearer ${token}`;
let hosDepBed = {};

$(document).ready(() => {
  checkLogIn();
  getHosDepBed();
});

// is it a good way?
function checkLogIn() {
  if (localStorage.getItem('token') === null) {
    window.location.href = './login.html';
  }
}

function logOut() {
  localStorage.removeItem('token');
  window.location.href = './login.html';
}

function getData(apiURL) {
  const completedURL = baseURL + apiURL;
  return new Promise(((resolve, reject) => {
    $.ajax({
      url: completedURL,
      dataType: 'json',
      type: 'GET',
      beforeSend(request) {
        request.setRequestHeader('Authorization', authorizationToken);
      },
      success(response) {
        resolve(response);
      },
      error(err) {
        reject(err);
      },
    });
  }));
}

function getHosDepBed() {
  const hosDepBad = Promise.resolve(getData('HosDepBedR'));
  hosDepBad.then((response) => {
    hosDepBed = response;
    showHosDepBed(hosDepBed);
    $('.side-nav--item:nth-child(2)').trigger('click');
  }).catch((error) => {
    console.log(error);
  });
}

function showHosDepBed(hosDepBed) {
  for (const depBed of hosDepBed) {
    $('.side-nav--body').append(
      `<li class="side-nav--item" onClick=loadAdmissionStatusByWard(this)>${depBed.WName}</li>`,
    );
  }
}

function loadAdmissionStatusByWard(ward) {
  refreshSideNavUI(ward);
  showWardAdmissionStatusLoadingUI();
  const WName = ward.innerHTML;
  const HWID = findHWID(WName);
  const apiURL = `AdmissionStatus/${HWID}`;
  getAdmissionStatusByWard(apiURL, WName);
}

function refreshSideNavUI(item) {
  $('.side-nav--body .side-nav--item').removeClass('side-nav--item__clicked');
  $(item).addClass('side-nav--item__clicked');
}

function showWardAdmissionStatusLoadingUI() {
  $('.content--header').html('<img class="spinner" src="images/spinner.gif" alt="loading">');
  $('.content--body').html('<div class="spinner-wrap"><img class="spinner" src="images/spinner.gif" alt="loading"></div>');
}

function findHWID(WName) {
  let HWID = '';
  for (const depBed of hosDepBed) {
    if (WName === depBed.WName) {
      HWID = depBed.HWID;
    }
  }
  return HWID;
}

function getAdmissionStatusByWard(apiURL, WName) {
  const allAdmissionStatus = Promise.resolve(getData(apiURL));
  allAdmissionStatus.then((response) => {
    showAdmissionStatus(response, WName);
  }).catch((error) => {
    showAdmissionStatus(null, WName);
    console.log(error);
  });
}

function showAdmissionStatus(allAdmissionStatus, WName) {
  $('.content--body *').remove();
  $('.content--header').text(WName);
  if (!allAdmissionStatus) {
    $('.content--body').append('<i class="no-data">--- 尚無資料 ---</i>');
  } else {
    showAdmissionStatusTableHead();
    showAdmissionStatusTableData(allAdmissionStatus);
  }
}

function showAdmissionStatusTableHead() {
  $('.content--body').append('<table class="admission-status"></table>');
  $('.admission-status').append(
    `<tr class="admission-status--head">
        <th>科別</th>
        <th>病床號碼</th>
        <th>病患資料</th>
        <th>住院日期</th>
        </tr>`,
  );
}

function showAdmissionStatusTableData(allAdmissionStatus) {
  if (allAdmissionStatus.length > 0) {
    for (const admissionStatus of allAdmissionStatus) {
      $('.admission-status').append(
        `<tr class=admission-status--data data-aid=${admissionStatus.AID} onClick="loadPatientData(this)">
                    <td>${admissionStatus.DepName}</td>
                    <td>${admissionStatus.WardNo}</td>
                    <td>
                        <span class="patient-name">${admissionStatus.CNM}</span>
                    </td>
                    <td>${admissionStatus.InHosDate}</td>
                </tr>`,
      );
    }
  } else {
    $('.content--body').append('<i class="no-data">--- 尚無資料 ---</i>');
  }
}

// PatientInfo
let patientAID = '';

function loadPatientData(patient) {
  refreshAdmissionStatusUI(patient);
  showPatientsAdmisstionLoadingUI();
  const AID = $(patient).data('aid');
  patientAID = AID;
  const patientInfoURL = `PatientInfoR?id=${AID}`;
  const admissionStatusURL = 'AdmissionStatus';
  getPatientAdmissionData(patientInfoURL, admissionStatusURL, AID);
}

function refreshAdmissionStatusUI(listItem) {
  $('.admission-status--data').removeClass('admission-status--data__clicked');
  $(listItem).addClass('admission-status--data__clicked');
}

function showPatientsAdmisstionLoadingUI() {
  $('.patient-info').html(
    `<div class="spinner-wrap">
        <img  class="spinner" src="images/spinner.gif" alt="loading">
        </div>`,
  );
}

function getPatientAdmissionData(patientInfoURL, admissionStatusURL, AID) {
  let patientInfo = {};
  let admissionStatus = {};
  Promise.all([getData(patientInfoURL), getData(admissionStatusURL)]).then((response) => {
    patientInfo = response[0];
    const allAdmissionStatus = response[1];
    admissionStatus = findAdmissionStatus(allAdmissionStatus, AID);
    const nisTopRecordURL = `NISTPR?id=${AID}&startDate=${admissionStatus.InHosDate}`;
    return getData(nisTopRecordURL);
  }).then((nisTopRecords) => {
    const patientsAdmissionData = generatePatientsAdmissionData(patientInfo, admissionStatus, nisTopRecords);
    showPatientsAdmissionData(patientsAdmissionData, AID);
  }).catch((error) => {
    $('.patient-info').html('<i class="no-data no-data--admission">--- 尚無住院資料 ---</i>');
    console.log(error);
  });
}

function findAdmissionStatus(allAdmissionStatus, AID) {
  for (const admisstionStatus of allAdmissionStatus) {
    if (admisstionStatus.AID == AID) {
      return admisstionStatus;
    }
  }
  return null;
}

function generatePatientsAdmissionData(patientInfo, admissionStatus, nisTopRecords) {
  const patientsAdmissionData = {};

  patientsAdmissionData.CNM = patientInfo.CNM;
  patientsAdmissionData.GENDER = (patientInfo.Gender == 0) ? '男' : '女'; // magic number problem??
  patientsAdmissionData.age = patientInfo.age;
  patientsAdmissionData.IDNO = patientInfo.IDNO;

  patientsAdmissionData.nisTopRecords = '';
  if (!jQuery.isEmptyObject(nisTopRecords)) {
    for (const nisTopRecord of nisTopRecords) {
      patientsAdmissionData.nisTopRecords
                += `<li>
            <span>${nisTopRecord.Item}</span>
            <span>${nisTopRecord.Value}</span>
            <span>${nisTopRecord.DateTime}</span>
            </li>`;
    }
  } else {
    patientsAdmissionData.nisTopRecords = '<li><i>---尚無資料---</i></li>';
  }

  patientsAdmissionData.ProblemNotes = interpretJsonString(admissionStatus.ProblemNotes);
  patientsAdmissionData.CatastrophicIllness = interpretJsonString(admissionStatus.CatastrophicIllness);
  patientsAdmissionData.Allergy = interpretJsonString(admissionStatus.Allergy);
  patientsAdmissionData.SpecialNotes = interpretJsonString(admissionStatus.SpecialNotes);
  patientsAdmissionData.Notes = interpretJsonString(admissionStatus.Notes);

  return patientsAdmissionData;
}

function showPatientsAdmissionData(patientsAdmissionData, AID) {
  $('.patient-info').html('<div class="patient-info"> <div class="patient-info--head"> <div> <h2 id="patient-name">Name</h2> <p id="patient-gender-and-age">Gender, Age</p> </div> <p id="patient-ID">ID number</p> </div> <div class="patient-info--body"> <div class="patient-report-area"> <div class="patient-report--btn" data-temp-code="Ad001">查房首頁</div> <div class="patient-report--btn" data-temp-code="Ad002">住院病患資訊</div> <div class="patient-report--btn" data-temp-code="Ad003">住院診斷</div> <div class="patient-report--btn" data-temp-code="Ad004">檢驗報告</div> <div class="patient-report--btn" data-temp-code="Ad005">DDC報告</div> <div class="patient-report--btn" data-temp-code="Ad006">病理報告</div> <div class="patient-report--btn" data-temp-code="Ad007"">檢查報告</div> <div class="patient-report--btn" data-temp-code="Ad008">生理報告</div> <div class="patient-report--btn" data-temp-code="Ad009">住院醫囑長期醫令</div> <div class="patient-report--btn" data-temp-code="Ad010">住院醫囑即時醫令</div> <div class="patient-report--btn" data-temp-code="Ad011">病歷摘要入院病摘</div> <div class="patient-report--btn" data-temp-code="Ad012">病歷摘要住院病摘</div> <div class="patient-report--btn" data-temp-code="Ad013">病歷摘要出院病摘</div> <div class="patient-report--btn" data-temp-code="Ad014">放射科報告</div> <div class="patient-report--btn" data-temp-code="Ad015">會診紀錄</div> <div class="patient-report--btn" data-temp-code="Ad016">歷史就醫紀錄</div> </div> <div class="nistpr-area"> <p class="problem-title">生命徵象</p> <ul class="nistpr-list"> <li><i>---尚無資料---</i></li> </ul> </div> <ul class="patient-notes"> <li> <p class="problem-title">問題註記</p> <ul class="problem-notes" id="problem-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">重大疾病</p> <ul class="problem-notes" id="catastrophic-illness-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">過敏紀錄</p> <ul class="problem-notes" id="allergy-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">特殊註記</p> <ul class="problem-notes" id="special-note"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> <li> <p class="problem-title">註記</p> <ul class="problem-notes" id="other-notes"> <li class="problem-note"> <div class="problem-note-detail-group"> <i>---尚無資料---</i> </div> </li> </ul> </li> </ul> </div> </div>');

  generateReportButton(AID);

  $('#patient-name').text(patientsAdmissionData.CNM);
  $('#patient-gender-and-age').text(`${patientsAdmissionData.GENDER}, ${patientsAdmissionData.age}歲`);
  $('#patient-ID').text(patientsAdmissionData.IDNO);

  $('.nistpr-list').html(patientsAdmissionData.nisTopRecords);
  $('#problem-note').html(patientsAdmissionData.ProblemNotes);
  $('#catastrophic-illness-note').html(patientsAdmissionData.CatastrophicIllness);
  $('#allergy-note').html(patientsAdmissionData.Allergy);
  $('#special-note').html(patientsAdmissionData.SpecialNotes);
  $('#other-notes').html(patientsAdmissionData.Notes);
}

function interpretJsonString(jsonString) {
  const NODATAMESSAGE = '<li class="problem-note"><div class="problem-note-detail-group"><i>---尚無資料---</i></div></li>';
  if (!jsonString) { // jsonString is "".
    return NODATAMESSAGE;
  }
  const jsonObject = JSON.parse(jsonString);
  let result = '';
  for (const subObject of jsonObject) {
    const subObjectKeys = Object.keys(subObject);
    result += '<li class="problem-note"><div class="problem-note-detail-group">';
    for (const subObjectKey of subObjectKeys) {
      result += `<div><span>${subObjectKey}: </span>`
                    + `<span>${subObject[subObjectKey]} </span></div>`;
    }
    result += '</div></li>';
  }
  return result;
}

function generateReportButton(AID) {
  // dirty code
  for (let i = 0; i < 16; i++) {
    const twoDigitNumber = (`0${i + 1}`).slice(-2);
    const tempCode = `Ad0${twoDigitNumber}`;
    const DocumentIndexesAPIURL = `DocumentIndexesR/${AID}?p=${tempCode}`;
    getData(DocumentIndexesAPIURL).then(() => {
      $(`.patient-report--btn:nth-child(${(i + 1)})`).on('click', (e) => {
        const { tempCode } = e.target.dataset;
        showReport(tempCode, AID);
      });
    }).catch(() => {
      $(`.patient-report--btn:nth-child(${(i + 1)})`).addClass('patient-report--btn__disable');
    });
  }
}

// report
function showReport(tempCode, AID) {
  window.open(`report.html?AID=${AID}&tempCode=${tempCode}`);
}

