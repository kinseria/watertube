require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
const anchorme = require("anchorme").default;
const https = require("https"); // Mainly for downloads
const ytsr = require("ytsr");
const strEscape = require("js-string-escape");
const ytrend = require("yt-trending-scraper");
const youtubeSuggest = require("youtube-suggest");
const ytch = require("yt-channel-info");
const config = require("./config.js");
const compression = require("compression");
const minifyHTML = require("express-minify-html");

function captions(info) {
  if (info.player_response.captions) {
    return info.player_response.captions.playerCaptionsTracklistRenderer
      .captionTracks;
  } else {
    return [];
  }
}

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(compression());
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      useShortDoctype: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    }
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/channel/:id", (req, res) => {
  var id = req.params.id;
  ytch
    .getChannelInfo(id)
    .then(info => {
      ytch
        .getChannelVideos(id, "newest")
        .then(videos => {
          res.render(
            "channel.ejs",
            Object.assign(info, {
              videos: videos.items.filter(item => item.type == "video"),
              anchorme: anchorme
            })
          );
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      res.render("500.ejs");
    });
});
app.get("/search", (req, res) => {
  res.set("Cache-Control", "max-age=604800"); // 1 week
  var query = req.query.q;
  if (!query) {
    res
      .render("400.ejs", { message: "Please provide a search term" })
      .status(400);
  } else {
    const results = ytsr(query)
      .then(data => {
        res.render("search.ejs", {
          query: query,

          data: data.items.filter(
            item => item.type == "video" || item.type == "channel"
          ) // hope to support channels soon!
        });
      })
      .catch(err => res.render("500.ejs"));
  }
});
app.get("/watch/:id", async function(req, res) {
  var id = req.params.id;
  res.set("Cache-Control", "max-age=14400"); // 4 Hours, links only last about 6
  if (!id || !ytdl.validateID(id)) {
    res.render("404.ejs");
  }
  ytdl
    .getInfo(id)
    .then(info => {
      res.render("player.ejs", {
        title: info.videoDetails.title,
        formats: info.player_response.streamingData.formats,
        description: info.videoDetails.description,
        related_videos: info.related_videos,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
        views: info.videoDetails.viewCount,
        author: info.videoDetails.author.name,
        strEscape: strEscape,
        captions: captions(info),
        url: `${config.baseUrl}/watch/${id}`,
        id: id,
        truncate: function(str, cutoff, replace) {
          if (str.length >= cutoff) {
            return (
              str
                .slice(0, cutoff)
                .replace(/\n/gm, " ")
                .replace(/  /gm, " ") + replace
            );
          } else {
            return str.replace(/\n/gm, " ").replace(/  /gm, " ");
          }
        },
        anchorme: anchorme
      });
    })
    .catch(err => {
      res.render("404.ejs");
    });
});
app.get("/listen/:id", (req, res) => {
  var id = req.params.id;
  res.set("Cache-Control", "max-age=14400"); // 4 Hours, links only last about 6
  if (!id || !ytdl.validateID(id)) {
    res.render("404.ejs");
  }
  ytdl
    .getInfo(id)
    .then(info => {
      res.render("audio.ejs", {
        title: info.videoDetails.title,
        formats: info.player_response.streamingData.formats,
        description: info.videoDetails.description.simpleText,
        related_videos: info.related_videos,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
        views: info.videoDetails.viewCount,
        author: info.videoDetails.author.name,
        strEscape: strEscape,
        captions: captions(info),
        url: `${config.baseUrl}/watch/${id}`,
        id: id,
        truncate: function(str, cutoff, replace) {
          if (str.length >= cutoff) {
            return (
              str
                .slice(0, cutoff)
                .replace(/\n/gm, " ")
                .replace(/  /gm, " ") + replace
            );
          } else {
            return str.replace(/\n/gm, " ").replace(/  /gm, " ");
          }
        },
        anchorme: anchorme
      });
    })
    .catch(err => {
      res.render("404.ejs");
    });
});
app.get("/stream/:id", (req, res) => {
  var id = req.params.id;
  res.set("Cache-Control", "max-age=14400"); // 4 Hours, links only last about 6
  if (!id || !ytdl.validateID(id)) {
    res.render("404.ejs");
  }
  ytdl(id, {
    quality: "highestaudio"
  }).pipe(
    res,
    { end: true }
  );
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

app.get("/autocomplete", (req, res) => {
  try {
    if (!req.query.q) {
      res.json([]);
    } else {
      youtubeSuggest(req.query.q).then(function(results) {
        res.json(results.length != 0 ? results : [req.query.q]);
      });
    }
  } catch (e) {
    res.json([]);
  }
});
app.get("/*", (req, res) => {
  // 404 page
  res.render("404.ejs");
});
app.listen(process.env.PORT || 3000);
