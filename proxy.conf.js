const PROXY_CONFIG = {
  "/api/*": {
    "target":  {
      "host": "lexonomy.elex.is",
      "protocol": "https:",
      "port": 443
    },
    "secure": true,
    "timeout": 30000,
    "changeOrigin": true,
    "bypass": (req, res) => {
      if (req.url === "/api/listDict") {
        var responseDictionaries = require("./src/assets/dictionaries.json");
        res.end(JSON.stringify(responseDictionaries));
        return true;
      }
    },
    "logLevel": "debug"
  },
  "/*.json": {
    "target":  {
      "host": "lexonomy.elex.is",
      "protocol": "https:",
      "port": 443
    },
    "secure": true,
    "timeout": 30000,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/logout": {
    "target":  {
      "host": "lexonomy.elex.is",
      "protocol": "https:",
      "port": 443
    },
    "secure": true,
    "timeout": 30000,
    "changeOrigin": true,
    "logLevel": "debug"
  },
}

module.exports = PROXY_CONFIG;
