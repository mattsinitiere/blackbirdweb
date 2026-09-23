/* Decorative only: no input interception, data collection, or dependencies. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.hero, .closing').forEach(host => {
    const canvas = document.createElement('canvas');
    canvas.className = 'interactive-dot-grid';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) return;
    host.prepend(canvas);
    host.classList.add('has-dot-grid');

    let width = 0, height = 0, dots = [], frame = 0, previous = 0, elapsed = 0;
    let visible = false;
    let pointer = { x: -1000, y: -1000, active: false };
    let ripples = [];
    const canMove = () => !reducedMotion.matches && finePointer.matches;
    const canRun = () => canMove() && visible && !document.hidden;

    function resize() {
      width = host.clientWidth;
      height = host.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const spacing = width < 600 ? 22 : 18;
      dots = [];
      for (let y = 10; y < height; y += spacing) {
        for (let x = 10; x < width; x += spacing) {
          dots.push({ homeX: x, homeY: y, x, y });
        }
      }
      render(0);
    }

    function render(delta) {
      const moving = canMove();
      elapsed += delta;
      context.clearRect(0, 0, width, height);
      const ease = moving ? 1 - Math.exp(-delta / 85) : 1;
      ripples = ripples.filter(r => elapsed - r.born < 1500);
      for (const dot of dots) {
        let dx = 0, dy = 0, proximity = 0, wave = 0;
        if (moving) {
          // A slow, shallow current keeps the grid alive between interactions.
          dx = Math.sin(dot.homeY * .017 + elapsed * .00045) * 1.6;
          dy = Math.sin(dot.homeX * .015 + elapsed * .00035) * 1.6;
          if (pointer.active) {
            const px = dot.homeX - pointer.x, py = dot.homeY - pointer.y;
            const distance = Math.hypot(px, py);
            proximity = Math.max(0, 1 - distance / 170);
            if (distance > .01 && proximity > 0) {
              const push = proximity * proximity * 24;
              dx += px / distance * push;
              dy += py / distance * push;
            }
          }
          for (const ripple of ripples) {
            const age = elapsed - ripple.born;
            const rx = dot.homeX - ripple.x, ry = dot.homeY - ripple.y;
            const distance = Math.hypot(rx, ry);
            const band = Math.exp(-Math.pow((distance - age * .32) / 34, 2));
            const strength = band * (1 - age / 1500);
            wave = Math.max(wave, strength);
            if (distance > .01) {
              dx += rx / distance * strength * 10;
              dy += ry / distance * strength * 10;
            }
          }
        }
        dot.x += (dot.homeX + dx - dot.x) * ease;
        dot.y += (dot.homeY + dy - dot.y) * ease;
        context.fillStyle = `rgba(27,25,66,${.16 + proximity * .29 + wave * .14})`;
        context.beginPath();
        context.arc(dot.x, dot.y, .8 + proximity * .65 + wave * .3, 0, Math.PI * 2);
        context.fill();
      }
    }

    function animate(now) {
      frame = 0;
      if (!canRun()) return;
      const delta = now - previous;
      // Cap drawing at 30 fps and avoid jumps after a hidden tab resumes.
      if (delta >= 32) { render(Math.min(delta, 64)); previous = now; }
      frame = requestAnimationFrame(animate);
    }
    function updateActivity() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previous = performance.now();
      if (canRun()) frame = requestAnimationFrame(animate);
      else if (!canMove()) {
        pointer.active = false;
        ripples = [];
        render(0);
      }
    }
    host.addEventListener('pointermove', event => {
      if (!canMove() || event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    }, { passive: true });
    host.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
    host.addEventListener('pointerdown', event => {
      if (!canMove() || event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: elapsed });
      if (ripples.length > 3) ripples.shift();
    }, { passive: true });
    window.addEventListener('scroll', () => { pointer.active = false; }, { passive: true });
    window.addEventListener('blur', () => { pointer.active = false; });
    document.addEventListener('visibilitychange', updateActivity);
    reducedMotion.addEventListener('change', updateActivity);
    finePointer.addEventListener('change', updateActivity);
    new ResizeObserver(resize).observe(host);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateActivity();
    }, { threshold: 0 }).observe(host);
    resize();
  });
})();
