$(document).ready(() => {
  document.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      login();
    }
  });

  $('.toggle-password').click(function () {
    $(this).toggleClass('fa-eye fa-eye-slash');
    ($('#password').attr('type') == 'password')
      ? $('#password').attr({ type: 'text' }) : $('#password').attr({ type: 'password' });
  });
});

// jQuery method
function login() {
  const account = $('#account').val();
  const password = $('#password').val();
  $.ajax({
    url: 'http://ep.ebmtech.com:9006/Token',
    dataType: 'json',
    type: 'POST',
    cache: false,
    data: {
      grant_type: 'password',
      username: account,
      password,
    },
    success(response) {
      localStorage.setItem('token', response.access_token);
      console.log('login success!');
      window.location.href = './hosDepBed.html';
    },
    error(err) {
      $('#errorMessage').css('visibility', 'visible');
    },
  });
}

// js method
function loginTest() {
  const account = document.getElementById('account').value;
  const password = document.getElementById('password').value;
  const data = {
    grant_type: 'password',
    username: account,
    password,
  };
  const request = new XMLHttpRequest();
  request.open('POST', 'http://ep.ebmtech.com:9006/Token', true);
  request.responseType = 'json';
  request.send(`grant_type=${data.grant_type}&username=${data.username}&password=${data.password}`);
  request.onload = function () {
    const { response } = request;
    localStorage.setItem('token', response.access_token);
    console.log('login success!!');
    window.location.href = './hosDepBed.html';
  };
  request.onerror = function () {
    $('#errorMessage').css('visibility', 'visible');
  };
}
