const router = require("express").Router();
const Url = require("../models/url");
const validUrl = require("valid-url");

// POST /api/shorturl
router.post("/api/shorturl", (req, res, next) => {
  const { url: urlParam } = req.body;

  if (!validUrl.isWebUri(urlParam)) {
    return next(new Error("invalid url"));
  }

  const url = new Url({
    original_url: urlParam,
  });

  url.save((error, data) => {
    if (error) return next(error);

    return res.json({
      original_url: data.original_url,
      short_url: data.short_url,
    });
  });
});

// GET /api/shorturl/:short_url
router.get("/api/shorturl/:short_url", (req, res, next) => {
  const { short_url } = req.params;

  Url.findOne({ short_url }, (error, data) => {
    if (error) return next(error);
    if (!data) return next(new Error("Invalid short url"));

    return res.redirect(data.original_url);
  });
});

module.exports = router;
