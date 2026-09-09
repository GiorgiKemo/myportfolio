(() => {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const groups = {
    websites: ['Hosting', 'Commerce', 'Websites', 'Services', 'Small business'],
    ai: ['AI', 'Agency', 'Small business'],
    creative: ['Creator', 'Reading', 'Rights'],
    career: ['Career'],
  };
  const rows = [...document.querySelectorAll('.guide-list li')];
  const buttons = [...bar.querySelectorAll('button[data-filter]')];
  const countLabel = bar.querySelector('.guide-count');
  const setCount = (count) => {
    countLabel.textContent = count + (count === 1 ? ' guide' : ' guides');
  };
  bar.hidden = false;
  setCount(rows.length);
  buttons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    rows.forEach((row) => {
      const topic = row.querySelector('.guide-topic').textContent.trim();
      row.hidden = selected !== 'all' && !groups[selected].includes(topic);
      if (!row.hidden) count += 1;
    });
    setCount(count);
  }));
})();
