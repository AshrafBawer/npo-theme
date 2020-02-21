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
