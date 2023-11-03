const express=require("express");
const app=express();
const port=3001;
const cors=require("cors");
const axios=require("axios");
require('dotenv').config();
const rateLimit=require("express-rate-limit")

var corOptions={
  origin: 'https://shaikclone.web.app'

}
const api_key = process.env.api_key;


// Create a rate limiter for a maximum of 5000 requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 5000 requests per IP in the windowMs time frame
  error: 'Too many requests from this IP, please try again later.',
});

// Apply the rate limiter middleware to all app.get routes
app.use(limiter);




app.get("/searchvideo", cors(corOptions),async(req,res)=>{
    try {
        // Extract the search query from the request body.
        const searchQuery = req.query.search;
        // Make a request to the YouTube Data API.
        const apiKey = api_key; 
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${searchQuery}&type=video&maxResults=7`;
        
        const response = await axios.get(apiUrl);
    
        // Return the YouTube API response to the client.
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.get("/getinitvideos", cors(corOptions), async (req,res)=>{

  const d=req.query.q;
console.log("data searched homepage os: " +d)
    try {
        const apiKey = api_key; 
        var searchResult;
        if(d=="All"){
           searchResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IN&key=${apiKey}&maxResults=30`);
        }
        else{
          searchResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${apiKey}&q=${d}&type=video&maxResults=30`);

        }
        res.status(200).json(searchResult.data);
      } 
      
      catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    
})

app.get('/serachdetailssong',cors(corOptions),async (req,res)=>{

try {
  const id=req.query.id;

  const apiKey = api_key; 

  const searchResult = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${id}&key=${apiKey}`);
  res.status(200).json(searchResult.data);
  
} catch (error) {
  
  console.log(error);
}

  

})


app.get("/suggestedvideos",cors(corOptions),async(req,res)=>{
  const id=req.query.id;
  try {
    
    const key = api_key; 
  
    const searchResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&maxResults=10&categoryId=${id}`);
    res.status(200).json(searchResult.data);

  } catch (error) {
    console.log(error);
  }
  
})

app.get("/",(req,res)=>{
    res.send("hello firoz welcome to server express")
})


app.get('/hello',cors(corOptions), async(req,res)=>{
  console.log(req);
  const id=req.query.searchid;
  try {
    const apiKey = api_key; 
  
    const searchResult = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${id}&type=video&videoType=any&maxResults=10`);
    res.status(200).json(searchResult.data);
    
  } catch (error) {
    
    console.log(error);
  }
  

})


app.listen(port,()=>{
    console.log(`listening on ${port}`);
})