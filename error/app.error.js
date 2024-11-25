exports.wrongPathHandler = (req, res, next) => {
  res.status(404).send({ msg: "Incorrect endpoint" });
};

exports.databaseErrorHandler = (err, req, res, next) => {
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "Bad request" });
  }
};

exports.validIdErrorHandler = (err, req, res, next) => {
  console.log(err);
};
