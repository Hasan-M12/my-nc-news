const endpointsJson = require("../endpoints.json");
const {
  selectTopics,
  selectArticlesByID,
  selectArticles,
  selectCommentsByArticleId,
  insertComments,
  updatingVotes,
  selectCommentsByCommentId,
  selectUsers,
} = require("../models/app.models");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesByID = (req, res, next) => {
  const articleId = req.params;
  selectArticlesByID(articleId.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticlesId = (req, res, next) => {
  const id = req.params;
  const articleId = id.article_id;
  return Promise.all([
    selectArticlesByID(articleId),
    selectCommentsByArticleId(articleId),
  ])
    .then((promises) => {
      res.status(200).send({ article: promises[0], comments: promises[1] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComments(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const id = req.params.article_id;
  const incVotes = req.body.inc_votes;
  updatingVotes(id, incVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectCommentsByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
