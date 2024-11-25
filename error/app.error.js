exports.wrongPathHandler = (req, res, next) => {
  res.status(404).send({ msg: "Incorrect endpoint" });
};
