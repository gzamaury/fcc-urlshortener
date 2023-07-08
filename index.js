require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// requires body-parser to get the POST parameters
const encodedDataHandler = bodyParser.urlencoded({ extended: false });
app.use(encodedDataHandler);
// Needed to parse POST parameters when testing
app.use(bodyParser.json());

const shorturlRouter = require("./routes/shorturl");

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const errorHandler = (error, req, res, next) => {
  res.json({
    error: error.message,
  });
};

app.use(shorturlRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;
let server = app;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, function () {
    console.log("Your app is listening on port " + server.address().port);
  });
}

module.exports = server;
