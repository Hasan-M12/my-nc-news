const db = require("../db/connection");


exports.selectTopics = (req, res) => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};
