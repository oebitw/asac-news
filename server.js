'use strict';

///////////////////////
// Dependencies     //
/////////////////////


//DOTENV (read our environment variable)
require('dotenv').config();

// Express Frame work
const express = require('express');

//CORS = Cross Origin Resource Sharing
const cors = require('cors');

// client-side HTTP request library
const superagent = require('superagent');

// path

const path = require('path');

const publicStaticDirPath = path.join(__dirname, './public');

const viewsPath = path.join(__dirname, './views');



/////////////////////////////
//// Application Setup    //
///////////////////////////


const PORT = process.env.PORT || 3030;
const app = express();
app.use(cors());



/////////////////////////////
//// Templating Engine//////
///////////////////////////


app.set('view engine', 'ejs');

app.set('views', viewsPath);

app.use(express.static(publicStaticDirPath));


////////////////////
//// Routes   /////
//////////////////

app.get('/', homeRouteHandler);

app.get('/news', newsHandler);



////////////////////////////
//// Routes Handler ///////
//////////////////////////

// Home Handler
function homeRouteHandler(req, res) {

  let keyword= req.query.keyword;


  let key = process.env.NEWS_KEY;

  let url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${key}`;

  superagent.get(url).then(newsData=>{
    let newsDataBody= newsData.body;

    let correctData = newsDataBody.articles.map(e=>{
      return new News(e);
    });

    res.render('index', {news: correctData});

  }) .catch(error => {
    res.send(error);
  });



}




//localhost:7777/news?keyword=xxx

function newsHandler (req, res){

  let keyword= req.query.keyword;


  let key = process.env.NEWS_KEY;

  let url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${key}`;

  superagent.get(url).then(newsData=>{
    let newsDataBody= newsData.body;

    let correctData = newsDataBody.articles.map(e=>{
      return new News(e);
    });

    res.render('news', {news: correctData, search: req.query.keyword});

  }) .catch(error => {
    res.send(error);
  });

}



////////////////////////////
//// Constructors   ///////
//////////////////////////

function News (data){
  this.title=data.title;
  this.img=data.urlToImage;
  this.description= data.description;
  this.date= new Date(data.publishedAt).toString().slice(0, 15);
  this.source= data.source.name;
  this.url=data.url;
}


/////////////////////////////
//// Server Listening   ////
///////////////////////////

app.listen(PORT, () =>
  console.log(`listening on ${PORT}`)
);

