/* eslint-disable no-undef */

// show password button

$('#show-pass').click(() => {
  const input = document.getElementById('password');
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
});

$('#sidebar').click(() => {
  $('.ui.labeled.icon.sidebar').sidebar('toggle');
});
