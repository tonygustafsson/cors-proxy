const express = require("express");
const request = require("request");

const app = express();

/* ------ SETTINGS ------ */
const apiOrigin = "https://api.myserver.com"; // The actual API Protocol + domain
const proxyListeningPath = "/api/*"; // "*" will listen for everything and send it to apiOrigin
const proxyDefaultPort = 3001; // This proxys listening port
const apiTimeout = 60000; // Number of milliseconds to wait for API responses
const allowCredentials = true; // Needed if credentials are used on site
const allowHeaders = ["x-xsrf-token", "x-requested-with", "content-type"]; // The headers that is allowed through
/* ----------------------- */

app.use((req, res, next) => {
  // Set necessary headers for all requests
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Credentials", allowCredentials);
  res.header("Access-Control-Allow-Headers", allowHeaders.join(","));

  next();
});

// Listen for GET requests for relevant paths
app.get(proxyListeningPath, (req, res) => {
  request(
    { url: `${apiOrigin}/${req.path}`, timeout: apiTimeout },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(
          `Could not handle ${req.path}. Message: ${response.statusMessage}.\nBody: ${body}.`
        );

        return res.status(response.statusCode).json({
          type: "GET",
          message: response.statusMessage,
          body: JSON.parse(body),
        });
      }

      console.log(`GET ${req.path}`);

      res.json(JSON.parse(body));
    }
  );
});

// Listen for POST requests for relevant paths
app.post(proxyListeningPath, (req, res) => {
  request(
    {
      url: `${apiOrigin}/${req.path}`,
      timeout: apiTimeout,
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(
          `Could not handle ${req.path}. Message: ${response.statusMessage}.\nBody: ${body}.`
        );

        return res.status(response.statusCode).json({
          type: "POST",
          message: response.statusMessage,
          body: JSON.parse(body),
        });
      }

      console.log(`POST ${req.path}`);

      res.json(JSON.parse(body));
    }
  );
});

const PORT = process.env.PORT || proxyDefaultPort;
app.listen(PORT, () => console.log(`CORS Proxy listening on ${PORT}`));
