'use strict';
(() => {
  const screen = document.querySelector('.tv-screen');
  const themeButtons = [...document.querySelectorAll('[data-tv-theme]')];
  themeButtons.forEach(button => button.addEventListener('click', () => {
    screen.dataset.theme = button.dataset.tvTheme;
    themeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

  const flow = document.querySelector('.tv-flow');
  const pauseButton = flow.querySelector('.flow-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = !('IntersectionObserver' in window);
  let paused = false;
  function syncAnimation() {
    flow.classList.toggle('is-running', visible && !paused && !reducedMotion.matches && !document.hidden);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? 'Play animation' : 'Pause animation';
    pauseButton.setAttribute('aria-label', paused ? 'Play setup animation' : 'Pause setup animation');
  }
  pauseButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      syncAnimation();
    }, { threshold: .15 }).observe(flow);
  }
  reducedMotion.addEventListener('change', syncAnimation);
  document.addEventListener('visibilitychange', syncAnimation);
  syncAnimation();
})();
