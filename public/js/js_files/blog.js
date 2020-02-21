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
