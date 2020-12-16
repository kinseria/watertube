const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
const anchorme = require("anchorme").default;
const https = require("https"); // Mainly for downloads
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/watch/:id", (req, res) => {
  var id = req.params.id;
  res.set("Cache-Control", " max-age=7200");
  ytdl.getInfo(id).then(info => {
    res.render("player.ejs", {
      title: info.videoDetails.title,
      formats: info.player_response.streamingData.formats,
      description: anchorme(info.videoDetails.description.simpleText),
      related_videos: info.related_videos,
      thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
      views: info.videoDetails.viewCount,
      author: info.videoDetails.author.name
    });
  });
});
app.get("/download/:id", (req, res) => {
  var id = req.params.id;
  res.set("Cache-Control", " max-age=7200");
  ytdl.getInfo(id).then(info => {
    https.get(info.player_response.streamingData.formats[0].url, function(file) {
      file.pipe(res);
    });
  });
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
