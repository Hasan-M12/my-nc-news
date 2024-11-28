const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: should respond an array of topic objects, each of which should have the following properties: slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const allTopics = body.topics;
        expect(allTopics).toHaveLength(3);
        allTopics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: should handle errors when accessing a non-existent endpoint", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("Incorrect endpoint");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should retrieve a specific article with the given article id number", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: should respond with a bad message when using an invalid id e.g. /banana", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        const articles = body.msg;
        expect(articles).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return an array of of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const allArticles = body.articles;
        allArticles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200: return an array of articles sorted by desc order of created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: endpoint does not exist", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect endpoint");
      });
  });
});

describe("GET /api/articles/articles_id/comments", () => {
  test("200: should respond with an array of all comment from article with a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const allComments = body.comments;
        allComments.forEach((eachComment) => {
          expect(eachComment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: should return an array of comments in a descending order by created_at", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const allComments = body.comments;
        expect(allComments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: should give an appropriate error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/articles/1/banana")
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg;
        expect(msg).toBe("Incorrect endpoint");
      });
  });
});

describe("POST /api/articles/article_id/comments", () => {
  test("201: should successfully post a comment and send the response back to the user", () => {
    const toPostComment = {
      username: "butter_bridge",
      body: "comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(toPostComment)
      .expect(201)
      .then(({ body }) => {
        const newComment = body.comment;
        expect(newComment).toHaveProperty("comment_id");
        expect(newComment).toHaveProperty("body");
        expect(newComment).toHaveProperty("article_id");
        expect(newComment).toHaveProperty("author");
        expect(newComment).toHaveProperty("votes");
        expect(newComment).toHaveProperty("created_at");
      });
  });
  test("400: Responds with an bad request error message when the path is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "New comment",
    };
    return request(app)
      .post("/api/articles/now-a-path/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article with added votes", () => {
    const newVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const updatedArticle = body.article;
        expect(updatedArticle.votes).toBe(110);
      });
  });
  test("200: responds with the updated votes with removed votes", () => {
    const newVotes = {
      inc_votes: -110,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const votes = body.article.votes;
        expect(votes).toBe(-10);
      });
  });
  test("400: Responds with a bad request error when trying to update an invalid article", () => {
    const newVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete comment and have no content when deleting content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: should respond with an error 400 bad request message when a comment is invalid", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test.only("200: expect an array of users to have length of 4", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        console.log(body)
        const { users } = body;
        expect(users).toHaveLength(4);
      });
  });
  test("200: responds with an array of objects with information of each users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: endpoint does not exist", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect endpoint");
      });
  });
});

describe("GET /api/articles?sort_by=created_at", () => {
  test("200: should sort by created_at in descending order as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        console.log(articles);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: should sort by created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
});
