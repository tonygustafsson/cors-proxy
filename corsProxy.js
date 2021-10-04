const express = require("express");
const request = require("request");

const app = express();

/* ------ SETTINGS ------ */
const apiOrigin = "https://api.myserver.com"; // The actual API Protocol + domain
const proxyListeningPath = "/api/*"; // "*" will listen for everything and send it to apiOrigin
const proxyDefaultPort = 3001; // This proxys listening port
const apiTimeout = 60000; // Number of milliseconds to wait for API responses
const allowCredentials = true; // Needed if credentials are used on site
const allowHeaders = ["x-xsrf-token", "x-requested-with"]; // The headers that is allowed through
/* ----------------------- */

app.use((req, res, next) => {
  // Set necessary headers for all requests
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Credentials", allowCredentials);
  res.header("Access-Control-Allow-Headers", allowHeaders.join(","));

  next();
});

app.get(proxyListeningPath, (req, res) => {
  // Listen for requests for relevant paths

  request(
    { url: `${apiOrigin}/${req.path}`, timeout: apiTimeout },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(`Could not handle ${req.path}. Error: ${error}`);
        return res.status(500).json({ type: "error", message: error });
      }

      console.log(`Handling ${req.path}`);

      res.json(JSON.parse(body));
    }
  );
});

const PORT = process.env.PORT || proxyDefaultPort;
app.listen(PORT, () => console.log(`CORS Proxy listening on ${PORT}`));
