const ytdl = require("ytdl-core");

ytdl.getInfo("dQw4w9WgXcQ").then(info => {
  const tracks =
    info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks;
  if (tracks && tracks.length) {
    console.log(
      "Found captions for",
      tracks.map(t => t.name.simpleText).join(", ")
    );
  }
});
