require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Url = require('./models/url');

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener Microservice

// requires body-parser to get the POST parameters
const encodedDataHandler = bodyParser.urlencoded({extended: false});
app.use(encodedDataHandler);

const shortenerPath = '/api/shorturl';
const gettingOriginalUrl = (req, res, next) => {
  console.log(`original url: ${req.body.url}`);
  req.original_url = req.body.url;
  
  next();
}
const gettingShortUrl = (req, res, next) => {
  let urlObj = {
    original_url: req.original_url
  };
  let url = new Url(urlObj);

  url.save((error, data) => {
    if (error) return next(error);

    console.log(`short_url: ${data.short_url}`);
    req.short_url = data.short_url;
    next(null , data);
  });
};

app.route(shortenerPath).post(gettingOriginalUrl, gettingShortUrl);


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
