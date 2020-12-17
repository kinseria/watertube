var youtubeSuggest = require('youtube-suggest')
youtubeSuggest('query').then(function (results) {
  console.log(results)
})