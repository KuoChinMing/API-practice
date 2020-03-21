import { promised } from "q";

let baseURL = 'http://ep.ebmtech.com:9006/api/';
const token = localStorage.getItem('token');
const authorizationToken = `Bearer ${token}`;

$(document).ready(() => {
  const url = new URL(window.location.href);
  const AID = url.searchParams.get('AID');
  const tempCode = url.searchParams.get('tempCode');
  getReportID(AID, tempCode);
});

function getData(apiURL) {
  const completedURL = baseURL + apiURL;
  return new Promise((resolve, reject) => {
    $.ajax({
      url: completedURL,
      dataType: 'json',
      type: 'GET',
      beforeSend(request) {
        request.setRequestHeader('Authorization', authorizationToken);
      },
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

function getReportID(AID, tempCode) {
  // const DocumentIndexesAPIURL = `DocumentIndexesR/${AID}?p=${tempCode}`;
  const DocumentIndexesAPIURL = `DocumentIndexesR/${AID}?p=${tempCode}&k=FilterAfterAdmission&i=0`;
  Promise.resolve(getData(DocumentIndexesAPIURL)).then((documnetIndexes) => {
    showReport(documnetIndexes);
  }).catch((error) => {
    $('#report-data').append('<p>Report doesn\'t exist.</p>');
    console.log(error);
    console.log('request DocumentIndexesR API fail.');
  });
}

function showReport(documentIndexes) {
  const report = [];
  const psHashes = new Map();
  let repID = '';
  for (let i = 0; i < documentIndexes.length; i++) {
    const documentIndex = documentIndexes[i];
    repID = documentIndex.RepID;
    psHashes.set(documentIndex.RepID, documentIndex.psHash); // recording repID & repPsHash
    const IsTmp = 'false';
    const reportDataAPIURL = `ReportDatasR/${repID}?p=${IsTmp}`;
    console.log(reportDataAPIURL);
    report[i] = getData(reportDataAPIURL);
  }
  openHTMLViewer(report, psHashes, repID);
}

function openHTMLViewer(report, psHashes, repID) {
  Promise.all(report).then((response) => {
    $('#report-data').html(response);
    $('#report-data tr[hidden]').removeAttr('hidden');
    $('#report-data input[type="button"]').on('click', (e) => {
      const accessionNumber = e.target.id.split('btn_ImgTrShow_')[1];
      baseURL = 'http://192.168.66.140/html5/ShowImage.html?';
      const completedURL = `${baseURL}psHash=${psHashes.get(repID)}&accessionNumber=${accessionNumber}`;
      window.location = completedURL;
    });
  }).catch((error) => {
    $('#report-data').append('<p>Report doesn\'t exist.</p>');
    console.log(error);
    console.log('request ReportData API fail.');
  });
}
