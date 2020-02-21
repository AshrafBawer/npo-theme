/* eslint-disable no-undef */

$('#post-create-form').submit(function (e) {
  e.preventDefault();
  const title = $(this).find('#post-title');
  const author = $(this).find('#post-author');
  const image = $(this).find('#post-image');
  const body = $(this).find('#post-body');

  if (title.val() && body.val()) {
    $.ajax({
      method: 'post',
      url: '/admin/blog',
      data: {
        title: title.val(),
        author: author.val(),
        image: image.val(),
        body: body.val(),
      },
    }).done((res) => {
      console.log(res);
      $('#post-create-form').find('#post-title').val('');
      $('#post-create-form').find('#post-author').val('');
      $('#post-create-form').find('#post-image').val('');
      $('#post-create-form').find('#post-body').val('');

      $.ajax({
        url: '/posts',
        method: 'GET',
      }).done((res) => {
        $('#posts').html(res);
      });
    });
  }
});

$.ajax({
  url: '/posts',
  method: 'GET',
}).done((res) => {
  $('#posts').html(res);
});

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


// ajax call to admin/home
$('.home-form').on('submit', function (e) {
  e.preventDefault();
  const input = $(this).find('.field #data');
  const name = input.data('name');
  const data = input.val();
  console.log(data);
  console.log(name);

  $.ajax({
    url: '/admin/home',
    method: 'POST',
    data: { name, data },
  }).done((response) => {
    console.log(response);
  });
});

$('#donor-form').on('submit', function (e) {
  e.preventDefault();
  const image = $(this).find('#logo-url').val();
  $.ajax({
    url: '/admin/donor',
    method: 'POST',
    data: { image },
  }).done(() => {
    $('#donor-form').find('#logo-url').val('');
    $.ajax({
      url: '/donors',
    }).done((res) => {
      $('#donors-list').html(res);
    });
  });
});

$.ajax('/donors').done((res) => {
  $('#donors-list').html(res);
});

/* eslint-disable no-undef */

$(document).ready(() => {
  // get current URL path and assign 'active' class
  const { pathname } = window.location;
  if (pathname === '/') {
    $('#navbar').addClass('navbar-hide');
    $(window).scroll(() => {
      if (window.scrollY > 300) {
        $('#navbar').removeClass('navbar-hide');
      }
    });
  }
  $(`#navbar > a[href="${pathname}"]`).addClass('active');
});

/* eslint-disable prefer-arrow-callback */

$('#subscribe_form').submit(function (e) {
  e.preventDefault();
  const formData = $(this).serializeArray();
  $.ajax({
    url: '/newsletter_subscribe',
    method: 'POST',
    data: { first_name: formData[0].value, email: formData[1].value },
  }).done((res) => {
    console.log(res);
  }).fail(function (err) {
    return err;
  });
});
