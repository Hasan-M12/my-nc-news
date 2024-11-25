const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticlesByID,
} = require("./controllers/app.controllers");
const {
  wrongPathHandler,
  databaseErrorHandler,
  validIdErrorHandler,
} = require("./error/app.error");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);
app.use(wrongPathHandler);
app.use(databaseErrorHandler);
app.use(validIdErrorHandler);

module.exports = app;
