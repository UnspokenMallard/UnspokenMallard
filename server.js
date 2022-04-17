const express = require("express");
const path = require("path");
const request = require("request");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(express.static(__dirname + "/dist/elexilink"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/elexilink/index.html"));
});

app.post("/api/*", function (req, res) {
  if (req.url === "/api/listDict") {
    var responseDictionaries = require("./src/assets/dictionaries.json");
    res.json(JSON.stringify(responseDictionaries));
    return;
  }
  console.log(req.body);
  request.post({ url: "https://lexonomy.elex.is/" + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.post("/*.json", function (req, res) {
  request.post({ url: "https://lexonomy.elex.is" + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.get("/logout", function (req, res) {
  request.get({ url: "https://lexonomy.elex.is" + req.url, body: req.body, json: true }, (err, res_, body) => {
    res.json(body);
  });
});

app.listen(process.env.PORT || 8080);
