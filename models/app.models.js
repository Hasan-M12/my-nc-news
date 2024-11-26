const db = require("../db/connection");

exports.selectTopics = (req, res) => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesByID = (id) => {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles
      ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
        SELECT comment_id, votes, created_at::varchar, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
