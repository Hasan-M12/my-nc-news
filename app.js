const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/app.controllers");
const { wrongPathHandler } = require("./error/app.error");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(wrongPathHandler);

module.exports = app;
