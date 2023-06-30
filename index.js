require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const validUrl = require('valid-url');

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

  if (!validUrl.isWebUri(req.body.url)) {
    return next(new Error('invalid url'));
  }
  
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
    next();
  });
};
const shortenerHandler = (req, res) => {
  let resObj = {
    original_url: req.original_url,
    short_url: req.short_url
  };

  res.json(resObj);
};
const errorHandler = (error, req, res, next) => {
  console.error("Error: " + error.message);
  let errorObj = {
    error: error.message
  };

  res.json(errorObj);
};

app.route(shortenerPath).post(
  gettingOriginalUrl, 
  gettingShortUrl,
  shortenerHandler,
  errorHandler
);

const redirectPath = '/api/shorturl/:short_url';
const findOriginalUrl = (req, res, next) => {
  let searchByShortUrl = {short_url: req.params.short_url};
  
  Url.findOne(searchByShortUrl, (error, data) => {
    if (error) return next(error);
    if (!data) return next(new Error('Invalid short url'));

    console.log(`original_url: ${data.original_url}`);
    req.original_url = data.original_url;

    next();
  });
};

app.route(redirectPath).get(findOriginalUrl, errorHandler);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
