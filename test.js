const ytdl = require("ytdl-core");

ytdl.getInfo("CZ9n1Bck_YY").then(info => {
  const tracks =
    info.player_response.captions.playerCaptionsTracklistRenderer;
console.log(tracks)
  
  if(typeof info.player_response.captions =){
    
  }
});
