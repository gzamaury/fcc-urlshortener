require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

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

app.route(shortenerPath).post(gettingOriginalUrl);


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
