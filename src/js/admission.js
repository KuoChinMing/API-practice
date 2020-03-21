function loadadmissionStatus() {
  const token = localStorage.getItem('token');
  const authorizationToken = `Bearer ${token}`;
  $.ajax({
    url: 'http://ep.ebmtech.com:9006/api/AdmissionStatus',
    dataType: 'json',
    type: 'GET',
    cache: false,
    beforeSend(xhr) {
      xhr.setRequestHeader('Authorization', authorizationToken);
    },
    success(response) {
      showadmissionStatus(response);
    },
    error(err) {
      $('#error').html('error');
    },
  });
}

loadadmissionStatus();

function showadmissionStatus(response) {
  for (i = 0; i < response.length; i++) {
    $('#admission-status').append(
      `<tr><td>${
        response[i].HWID}</td><td><a href="./patientInfo.html">${
        response[i].AID}</td><td></a>${
        response[i].WardNo}</td><td>${
        response[i].BedNo}</td><td>"${
        response[i].InHosDate}</td></tr>`,
    );
  }
}
