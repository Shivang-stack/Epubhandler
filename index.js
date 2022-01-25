require("dotenv").config(); // this line should always come first.
const express = require("express");
const EPub = require("epub");
const https = require("https");
const fs = require("fs");
// body parser is not required
let port=process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


try{

  const url = "https://yesmentor-admin-content.s3.ap-south-1.amazonaws.com/video/pg67180-images.epub"
  https.get(url, function(res){
    const fileStream = fs.createWriteStream("example3.epub");
    res.pipe(fileStream);
    fileStream.on("finish",function(){
      fileStream.close();
      
      const epub = new EPub("example.epub");
      epub.parse();  
      
      app.get("/", (req, res) => {
    
        epub.flow.forEach(function(chapter){
          console.log(chapter.id);
        });
        
        //epub.getChapter('ch8', (err, text) => {
            //console.log(err);
            //console.log(epub.flow)
            //res.send(text);
          //})
        
      });

    })
  })
}catch(err)
{
  console.log(err.message)
}



app.use((err, req, res, next) => {
  return res.status(400).json({ error: err.message });
});


app.listen(port, () => console.log("Server started..."));
