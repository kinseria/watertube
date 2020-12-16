const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/watch", (req, res) => {
  res.set("Cache-Control", " max-age=7200")
  ytdl.getInfo(req.query.id).then(info => {
    res.render("player.ejs", {
      title: info.videoDetails.title,
      url: info.player_response.streamingData.formats[0].url,
      description:info.videoDetails.simpleText
    });
  });
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
