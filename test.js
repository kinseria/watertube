const ytdl = require("ytdl-core");

ytdl.getInfo("CZ9n1Bck_YY").then(info => {

});
function captions(info){
    if(info.player_response.captions){
    return info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks
  } else {
    return []
  }
}