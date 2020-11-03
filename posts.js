const express = require("express");
const { getUser } = require("./users");

const posts = [];
function Post({ body, userId }) {
  return {
    id: posts.length,
    body,
    userId,
  };
}

const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
  const user = await getUser(req);
  res.json(posts);
});

postsRouter.get("/:id", async (req, res) => {
  const user = await getUser(req);
  const id = Number(req.params.id);
  const post = posts.find((post) => post.id === id);
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

postsRouter.post("/", async (req, res) => {
  const user = await getUser(req);
  const newPost = Post({ body: req.body.body, userId: user.id });
  posts.push(newPost);
  res.json(newPost);
});

module.exports = { postsRouter };
