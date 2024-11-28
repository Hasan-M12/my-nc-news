const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");

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

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
  const validSortBy = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
  ];

  let query = `
    SELECT a.article_id, a.title, a.topic, a.author, a.created_at, 
    a.votes, a.article_img_url, COUNT(c.comment_id)::INTEGER AS comment_count
    FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id `;
  const queryValues = [];
  if (sort_by) {
    query += `ORDER BY ${sort_by} ${order} `;
  }
  return db.query(query, queryValues).then(({ rows }) => {
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
      if (rows.length === 0) {
        return Promises.reject({
          status: 404,
          msg: "article or comments not found",
        });
      }
      return rows;
    });
};

exports.insertComments = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updatingVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

exports.selectCommentsByCommentId = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments WHERE comment_id = $1 RETURNING *;
    `,
      [comment_id]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment not found",
        });
      }
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
