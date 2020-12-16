(async () => {
  const ytsr = require("ytsr");

  const searchResults = await ytsr("github");
  console.log(searchResults);
})();
