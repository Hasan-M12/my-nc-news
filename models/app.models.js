const db = require("../db/connection");
// const data = require("../db/data/")

exports.selectTopics = (req, res) => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};
