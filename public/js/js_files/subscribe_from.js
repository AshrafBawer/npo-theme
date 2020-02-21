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
