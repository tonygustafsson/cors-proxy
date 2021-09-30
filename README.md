# CORS Proxy

This simple proxy tool is a setup that is using `NodeJS`, `express` and `request` in a way that makes browsers ignore the CORS security. You need to change the API URLs from the current to this service URL for this to work. This tool will simply act as a proxy and fetch the real response from the API, add a few headers and send it back to the browser. Only for development environments of course.

## Why

I was simply tired of "CORS Anywhere" programs and extensions that simply didn't work. Often it was because Chrome does not allow wildcard `Access-Control-Allow-Origin`, but needs this set to a single origin. In other cases it was because I needed specific headers to be allowed.

If this tool doesn't work for you, you have to analyze the network trafic in the browser. It will probably tell you that a specific header is not allowed or whatever. Just add them in that case to the setting `allowHeaders`.

## Run it

```
npm install
Change settings in corsProxy.js
npm start
Change the API domains from the current to http://localhost:3001 (or whatever port you prefer)
```
