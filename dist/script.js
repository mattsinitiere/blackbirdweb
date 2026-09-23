'use strict';
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectPanel(name,focus=false){tabs.forEach(t=>{const selected=t.dataset.panel===name;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById('panel-'+t.dataset.panel).hidden=!selected;if(selected&&focus)t.focus()})}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>selectPanel(t.dataset.panel));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectPanel(tabs[next].dataset.panel,true)}})});
document.querySelectorAll('[data-select]').forEach(a=>a.addEventListener('click',()=>selectPanel(a.dataset.select)));
const score=document.getElementById('demo-score'),scoreButton=document.getElementById('score-button');
scoreButton.addEventListener('click',()=>{score.textContent='161';scoreButton.textContent='Visit recorded ✓';scoreButton.disabled=true});
document.getElementById('reset-button').addEventListener('click',()=>{score.textContent='301';scoreButton.innerHTML='Score 140 <span aria-hidden="true">↵</span>';scoreButton.disabled=false});
const games={
'X01':['THE CLASSIC COUNTDOWN','One Perfect Finish.','Start at 301, 501, or 701 and work your way to zero. Choose double-out and play a single leg or a best-of match.'],
'Cricket':['CLOSE THE NUMBERS','Make Your Marks.','Play Standard, Cutthroat, or No-score Cricket. Follow every close, every point, and your live marks per round.'],
'Baseball':['NINE INNINGS. YOUR BOARD.','Step Up to the Line.','Bring Baseball to the dartboard. Score runs across nine innings, with extra innings to break a tie.'],
'Around the Clock':['ONE NUMBER AT A TIME','Work Your Way Around.','Take on the board in sequence. Blackbird tracks your targets hit and darts thrown as you make your way around.'],
'Killer':['EVERY LIFE COUNTS','Keep Yourself in the Game.','Claim your number, become a killer, and take on the other players. Blackbird keeps track of the lives.'],
'Shanghai':['A DIFFERENT TARGET EACH ROUND','Find Your Shanghai.','Build your score round by round, or hit the single, double, and triple of the round’s number for a Shanghai.'],
'Halve It':['HIT THE TARGET. KEEP YOUR SCORE.','Make the Next Round Count.','Work through the target rounds and protect your total. Miss a round’s target and your score is halved.'],
'Gotcha':['THE CHASE IS ON','Catch Your Competition.','Build toward the target score and reset a rival by landing on their total. Blackbird tracks the resets and the race.'],
'Tic-Tac-Toe':['THREE IN A ROW','Play the Board Differently.','Turn the familiar grid into a darts challenge. Claim squares and build a winning line while Blackbird keeps track.']};
document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-game]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});const [k,t,p]=games[b.dataset.game];document.getElementById('game-title').textContent=t;document.getElementById('game-copy').textContent=p}));

// Reveal accurate product counts once, with a static fallback and reduced-motion support.
(() => {
  const cards = [...document.querySelectorAll('.stat-card')];
  const region = document.querySelector('.capabilities');
  if (!region || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, started = false;
  const finish = () => {
    cancelAnimationFrame(frame);
    cards.forEach(card => { const number = card.querySelector('[data-count]'); number.textContent = number.dataset.count; });
    region.classList.add('stats-revealed');
  };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || started) return;
    started = true; observer.disconnect();
    region.classList.add('stats-revealed');
    if (motion.matches) { finish(); return; }
    const start = performance.now();
    function tick(now) {
      if (motion.matches || document.hidden) { finish(); return; }
      let complete = true;
      cards.forEach((card, i) => {
        const number = card.querySelector('[data-count]');
        const progress = Math.min(1, Math.max(0, (now - start - i * 100) / 1000));
        number.textContent = String(Math.round(Number(number.dataset.count) * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) complete = false;
      });
      if (!complete) frame = requestAnimationFrame(tick); else finish();
    }
    frame = requestAnimationFrame(tick);
  }, { threshold: .25 });
  observer.observe(region);
  motion.addEventListener('change', () => { if (motion.matches) finish(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && started) finish(); });
})();
