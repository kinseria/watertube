(async () => {
  const ytsr = require("ytsr");

  const results = await ytsr("github");
  var i = 0
  while(i < results.items.length){
    results.items[i].url
    
    i++
  }
})();
