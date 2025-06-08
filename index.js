const { Client } = require("lrclib-api");
const { exec } = require("child_process");

const APPLESCRIPT = "getinfo.applescript";
const delay = 0.8;

const client = new Client();

const getSongInfo = () => {
  return new Promise((resolve, reject) => {
    exec(`osascript ${APPLESCRIPT}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const [track, artist, position] = stdout.trim().split("/");
      resolve({track, artist, position});
    });
  });
}

const playLyrics = (syncedLyrics, fetchTime) => {
  let index = 0;
  const getElapsed = () => Date.now() / 1000 - fetchTime;

  const bold = str => `\x1b[1m${str}\x1b[0m`;            // bold
  const cyan = str => `\x1b[36m${str}\x1b[0m`;           // cyan
  const dim = str => `\x1b[2m${str}\x1b[0m`;             // dim

  while (index < syncedLyrics.length && getElapsed() - delay >= syncedLyrics[index].startTime) {
    index++;
  }

  const interval = setInterval(() => {
    const elapsed = getElapsed();

    while (index < syncedLyrics.length && elapsed - delay >= syncedLyrics[index].startTime) {
      const prev = syncedLyrics[index - 1]?.text || "";
      const current = syncedLyrics[index]?.text || "";
      const next = syncedLyrics[index + 1]?.text || "";

      console.clear();
      console.log(dim(prev));
      console.log(bold(cyan(current)));
      console.log(next);

      index++;
    }

    if (index >= syncedLyrics.length) {
      clearInterval(interval);
    }
  }, 30);
}

(async () => {
  const info = await getSongInfo();
  console.log(info);
  const fetchTime = Date.now()/1000 - info.position;

  const query = {
    track_name: info.track,
    artist_name: info.artist,
  };

  const syncedLyrics = await client.getSynced(query);

  if(syncedLyrics) {
    playLyrics(syncedLyrics, fetchTime);
  } else {
    console.log(syncedLyrics);
  }

})();