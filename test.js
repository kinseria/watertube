const ytdl = require("ytdl-core");

ytdl.getInfo("CZ9n1Bck_YY").then(info => {
  const tracks =
    info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks;
  if (tracks && tracks.length) {
    console.log(
      "Found captions for",
      tracks.map(t => t.name.simpleText).join(", ")
    );
  }
});
