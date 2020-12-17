const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
const anchorme = require("anchorme").default;
const https = require("https"); // Mainly for downloads
const ytsr = require("ytsr");
const strEscape = require("js-string-escape");
const ytrend = require("yt-trending-scraper");
const CommentScraper = require("yt-comment-scraper");
const ytcomments = new CommentScraper();

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/search", (req, res) => {
  res.set("Cache-Control", "max-age=604800"); // 1 week
  var query = req.query.q;
  if (!query) {
    res.render("400.ejs", { message: "Please provide a search term" });
  } else {
    const results = ytsr(query)
      .then(data => {
        res.render("search.ejs", {
          query: query,
          data: data.items.filter(item => item.type == "video") // hope to support playlists/channels soon!
        });
      })
      .catch(err => res.render("500.ejs"));
  }
});
app.get("/watch/:id", (req, res) => {
  var id = req.params.id;
  res.set("Cache-Control", "max-age=14400"); // 4 Hours, links only last about 6
  if (!id || !ytdl.validateID(id)) {
    res.render("404.ejs");
  }
  ytdl
    .getInfo(id)
    .then(info => {
      ytcomments.scrape_next_page_youtube_comments(id).then(data => {
        res.render("player.ejs", {
          title: info.videoDetails.title,
          formats: info.player_response.streamingData.formats,
          description: anchorme(info.videoDetails.description.simpleText),
          related_videos: info.related_videos,
          thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
          views: info.videoDetails.viewCount,
          author: info.videoDetails.author.name,
          strEscape: strEscape,
          comments: data
        });
      });
    })
    .catch(err => {
      res.render("404.ejs");
    });
});
app.get("/download/:id", (req, res) => {
  var id = req.params.id;
  if (!id || !ytdl.validateID(id)) {
    res.render("404.ejs");
  }
  res.set("Cache-Control", " max-age=7200");
  ytdl
    .getInfo(id)
    .then(info => {
      https.get(info.player_response.streamingData.formats[0].url, function(
        file
      ) {
        file.pipe(res);
      });
    })
    .catch(err => {
      res.render("404.ejs");
    });
});
app.get("/*", (req, res) => {
  // 404 page
  res.render("404.ejs");
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
