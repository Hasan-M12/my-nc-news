const express = require("express");
const app = express();
const {wrongPathHandler} = require("./error/app.error")
const { getApi, getTopics } = require("./controllers/app.controllers");

app.use(express.json())

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(wrongPathHandler);


module.exports = app;
