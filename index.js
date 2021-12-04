import express from "express";
import request from "request";
import dotenv from "dotenv";
import { isJsonString, getSettings } from "./utils.js";

dotenv.config();
const settings = getSettings();
const app = express();

// Set necessary headers for all requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Credentials", settings.allowCredentials);
  res.header("Access-Control-Allow-Headers", settings.allowHeaders);

  next();
});

// Listen for GET requests for relevant paths
app.get(settings.proxyListeningPath, (req, res) => {
  request(
    { url: `${settings.apiOrigin}/${req.path}`, timeout: settings.apiTimeout },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(
          `Could not handle ${req.path}. Message: ${
            response.statusMessage
          }.\nBody: ${body || "Empty"}.`
        );

        return res.status(response.statusCode).json({
          type: "GET",
          message: response.statusMessage,
          body: body ? JSON.parse(body) : null,
        });
      }

      if (isJsonString(body)) {
        const newBody = body.replaceAll(
          `${settings.apiOrigin}${settings.proxyListeningPath.slice(0, -2)}`,
          `http://localhost:${
            settings.proxyDefaultPort
          }${settings.proxyListeningPath.slice(0, -2)}`
        );

        res.json(JSON.parse(newBody));
      } else {
        res.send(body);
      }
    }
  );
});

// Listen for POST requests for relevant paths
app.post(settings.proxyListeningPath, (req, res) => {
  request(
    {
      url: `${settings.apiOrigin}/${req.path}`,
      body: res.body,
      timeout: settings.apiTimeout,
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

// Start listener
const PORT = process.env.PORT || settings.proxyDefaultPort;
app.listen(PORT, () =>
  console.log(
    `CORS Proxy listening on ${PORT}\nSettings: ${JSON.stringify(
      settings,
      null,
      2
    )}`
  )
);
