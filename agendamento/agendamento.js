(function () {
  // Evento de contato ao clicar em qualquer botão de WhatsApp
  document.querySelectorAll('.js-wa').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', {
          content_name: 'Agendamento Fisioterapia Pélvica',
          content_category: a.getAttribute('data-local') || 'botao'
        });
      }
    });
  });

  // Botão fixo no mobile: aparece depois da primeira tela e some junto do fechamento
  var sticky = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  var closing = document.querySelector('.closing');
  if (!sticky || !hero || !closing || !('IntersectionObserver' in window)) return;
  var heroOut = false, closingIn = false;
  function update() {
    var show = heroOut && !closingIn;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    sticky.querySelector('a').tabIndex = show ? 0 : -1;
  }
  new IntersectionObserver(function (e) {
    heroOut = !e[0].isIntersecting && e[0].boundingClientRect.top < 0;
    update();
  }).observe(hero);
  new IntersectionObserver(function (e) {
    closingIn = e[0].isIntersecting;
    update();
  }, { threshold: 0.35 }).observe(closing);
})();
