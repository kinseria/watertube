const ytdl = require("ytdl-core");

ytdl.getInfo("CZ9n1Bck_YY").then(info => {
  var captions = [];

  console.log(
    info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks.name
  );
});
