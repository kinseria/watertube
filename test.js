(async () => {
  const ytdl = require("ytdl-core");
  var id = "dQw4w9WgXcQ";

  ytdl.getInfo(id).then(info => {
    console.log("title:", info.videoDetails.title);
    console.log("rating:", info.player_response.videoDetails.averageRating);
    console.log("uploaded by:", info.videoDetails.author.name);
    console.log("url:", info.player_response.streamingData.formats[0].url);
  });
})();
