const express = require("express");
const request = require("request");

const app = express();

/* ------ SETTINGS ------ */
const siteOrigin = "http://localhost:3000"; // The site URL that is using the API
const apiOrigin = "https://api.myserver.com"; // The actual API Protocol + domain

const proxyListeningPath = "/api/*"; // "*" will listen for everything and send it to apiOrigin
const proxyDefaultPort = 3001; // This proxys listening port

const allowCredentials = true; // Needed if credentials are used on site
const allowHeaders = ["x-xsrf-token", "x-requested-with"]; // The headers that is allowed through
/* ----------------------- */

app.use((req, res, next) => {
  // Set necessary headers for all requests
  res.header("Access-Control-Allow-Origin", siteOrigin);
  res.header("Access-Control-Allow-Credentials", allowCredentials);
  res.header("Access-Control-Allow-Headers", allowHeaders.join(","));

  next();
});

app.get(proxyListeningPath, (req, res) => {
  // Listen for requests for relevant paths

  request({ url: `${apiOrigin}/${req.path}` }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      console.error(`Could not handle ${req.path}. Error: ${error.message}`);
      return res.status(500).json({ type: "error", message: error.message });
    }

    console.log(`Handling ${req.path}`);

    res.json(JSON.parse(body));
  });
});

const PORT = process.env.PORT || proxyDefaultPort;
app.listen(PORT, () => console.log(`CORS Proxy listening on ${PORT}`));
