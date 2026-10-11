(function () {
  try {
    if (localStorage.getItem('theme') === 'light') document.documentElement.classList.add('light');
  } catch (e) {}
  var el = document.getElementById('log');
  var t = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  el.innerHTML =
    '<b>time</b>     ' + t + '\n' +
    '<b>path</b>     ' + location.pathname.replace(/[<>&]/g, '') + '\n' +
    '<b>agent</b>    ' + navigator.userAgent.replace(/[<>&]/g, '') + '\n' +
    '<b>result</b>   redirected to honeypot';
  // Certificate images stay hidden until they actually decode; broken files
  // keep the placeholder (same behaviour the old inline onload attributes had).
  var imgs = document.querySelectorAll('.cert img');
  for (var i = 0; i < imgs.length; i++) {
    (function (img) {
      function show() {
        img.hidden = false;
        if (img.nextElementSibling) img.nextElementSibling.hidden = true;
      }
      if (img.complete && img.naturalWidth > 0) show();
      else img.addEventListener('load', show);
    })(imgs[i]);
  }
})();
