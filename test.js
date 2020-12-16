const ytsr = require("ytsr");

const results = ytsr("github")
  .then(data => console.log(data.items))
  .catch(err => console.error(err));
