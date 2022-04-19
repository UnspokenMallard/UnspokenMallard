const configurationFile = require("./config.json");
const express = require("express");
const path = require("path");
const request = require("request");
const bodyParser = require('body-parser');
const app = express();
const config = configurationFile[process.env.CONFIG || "testing"];
const refreshRateInMs = config.cacheRefreshRate;
app.use(bodyParser.json({ extended: true }));
app.use(express.static(__dirname + "/dist/elexilink"));

const auth = {
  email: config.email,
  apikey: config.apiKey,
};

let cachedDictionaries = require("./src/assets/dictionaries.json");
const isString = (t) => typeof t === "string" || t instanceof String;
if (config.useCache) {
  setInterval(() => {
    request.post({ url: config.serverUrl + "/api/listDict", body: auth, json: true }, (err, res_, body) => {
      if (!isString()) {
        cachedDictionaries = body;
      } else {
        console.warn("/api/listDict failed");
      }
    });
  }, refreshRateInMs);
}


app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/elexilink/index.html"));
});

app.post("/api/*", function (req, res) {
  if (req.url === "/api/listDict" && config.useCache) {
    res.json(JSON.stringify(cachedDictionaries));
    return;
  }
  request.post({ url: config.serverUrl + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.post("/*.json", function (req, res) {
  request.post({ url: config.serverUrl + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.get("/logout", function (req, res) {
  request.get({ url: config.serverUrl + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.listen(process.env.PORT || 8080);
