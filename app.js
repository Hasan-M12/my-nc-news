const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticlesByID,
  getArticles,
  getCommentsByArticlesId,
  postComment,
  updateVotes,
  deleteComment,
  getUsers,
} = require("./controllers/app.controllers");
const {
  wrongPathHandler,
  databaseErrorHandler,
  validIdErrorHandler,
  handleCustomErrors,
} = require("./error/app.error");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticlesId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers)

app.use(wrongPathHandler);

app.use(databaseErrorHandler);

app.use(validIdErrorHandler);

app.use(handleCustomErrors);

module.exports = app;
