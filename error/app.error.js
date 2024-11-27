exports.wrongPathHandler = (req, res, next) => {
  res.status(404).send({ msg: "Incorrect endpoint" });
};

exports.databaseErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.validIdErrorHandler = (err, req, res, next) => {
  console.log(err);
};
