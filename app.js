const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controllers/app.controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

module.exports = app;
