const CommentScraper = require("yt-comment-scraper")
// the two boolean variable default to true and false.
const ytcomments = new CommentScraper()

for(let i = 0; i < 1; i++){
    ytcomments.scrape_next_page_youtube_comments("nvEe8IF76jU").then((data) =>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    });
}