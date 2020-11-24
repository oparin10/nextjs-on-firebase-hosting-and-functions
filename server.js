const functions = require("firebase-functions");
const admin = require("firebase-admin");
const next = require("next");
const config = require("./next.config");

admin.initializeApp();

const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev: dev,
  conf: config,
});

const handle = app.getRequestHandler();

exports.nextjs = functions.https.onRequest((request, response) => {
  console.log("Current page:" + request.originalUrl);

  return app.prepare().then(() => handle(request, response));
});
