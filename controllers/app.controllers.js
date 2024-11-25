const endpointsJson = require("../endpoints.json");
const {selectTopics} = require("../models/app.models")
const express = require("express")

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  })
  .catch((err) => {
    next(err)
  })
};
