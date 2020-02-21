
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
