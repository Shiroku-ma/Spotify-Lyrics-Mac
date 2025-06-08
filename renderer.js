const delay = 0.8;
let paused = false;

window.api.getLyrics().then(({ syncedLyrics, fetchTime }) => {
  let index = 0;
  let pausedTime = 0;

  const getElapsed = () => Date.now() / 1000 - fetchTime - delay - pausedTime;

  while (index < syncedLyrics.length && getElapsed() >= syncedLyrics[index].startTime) {
    index++;
  }

  let lastTime = Date.now();

  const updateLyrics = setInterval(() => {
    const now = Date.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    if (paused) {
        pausedTime += delta;
        return;
    };

    const elapsed = getElapsed();

    while (index < syncedLyrics.length && elapsed >= syncedLyrics[index].startTime) {
      const prev = syncedLyrics[index - 1]?.text || '';
      const current = syncedLyrics[index]?.text || '';
      const next = syncedLyrics[index + 1]?.text || '';

      document.getElementById('prev').textContent = prev;
      document.getElementById('current').textContent = current;
      document.getElementById('next').textContent = next;

      index++;
    }

    if (index >= syncedLyrics.length) {
      clearInterval(updateLyrics);
    }
  }, 30);

  setInterval(async () => {
    const status = await window.api.getStatus();
    paused = (status !== "playing");
  }, 1000);
});