const baseURL = 'http://ep.ebmtech.com:9006/';
const AID = localStorage.getItem('AID');
const InHosDate = localStorage.getItem('InHosDate');
const token = localStorage.getItem('token');
const authorizationToken = `Bearer ${token}`;

loadNISTPR();

function loadNISTPR() {
  const complatedURL = `${baseURL}api/NISTPR?id=${AID}&startDate=${InHosDate}`;
  $.ajax({
    url: complatedURL,
    dataType: 'json',
    type: 'GET',
    beforeSend(request) {
      request.setRequestHeader('Authorization', authorizationToken);
    },
    success(response) {
      showNISTopRecord(response);
    },
    error(err) {
      console.log(err.responseJSON.Message);
      console.log('request NISTPR fail.');
    },
  });
}

function showNISTopRecord(record) {
  showRecordTableHead();
  showRecordTableData(record);
}

function showRecordTableHead() {
  $('#record').append(
    '<tr><th>'
        + '檢驗名稱' + '</th><th>'
        + '數值' + '</th><th>'
        + '檢驗時間' + '</th><tr>',
  );
}

function showRecordTableData(record) {
  for (i = 0; i < record.length; i++) {
    $('#record').append(
      `<tr><td>${
        record[i].Item}</td><td>${
        record[i].Value}</td><td>${
        record[i].DateTime}</td></tr>`,
    );
  }
}
