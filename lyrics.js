const { Client } = require("lrclib-api");
const { exec } = require("child_process");

const APPLESCRIPT = "getinfo.applescript";
const client = new Client();

const getSongInfo = () => {
  return new Promise((resolve, reject) => {
    exec(`osascript ${APPLESCRIPT}`, (error, stdout) => {
      if (error) return reject(error);
      const [track, artist, position] = stdout.trim().split("/");
      resolve({ track, artist, position: parseFloat(position) });
    });
  });
};

const getLyrics = async () => {
  const info = await getSongInfo();
  const fetchTime = Date.now() / 1000 - info.position;

  const query = {
    track_name: info.track,
    artist_name: info.artist,
  };

  const syncedLyrics = await client.getSynced(query);
  return { syncedLyrics, fetchTime };
};

const getStatus = () => {
  return new Promise((resolve, reject) => {
    exec("osascript getstatus.applescript", (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout.trim()); // "playing" または "paused"
    });
  });
};

module.exports = { getLyrics, getStatus };