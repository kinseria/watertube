(async() => {
  const ytdl = require('ytdl-core');
  console.log(await ytdl.getInfo("https://youtu.be/dQw4w9WgXcQ").videoDetails)
})();