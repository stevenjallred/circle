//@ts-check
const express = require("express");
const { getUser } = require("./users");
const { knex } = require("./knex");

const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
  const user = await getUser(req);
  const posts = await knex("posts").orderBy("id");
  res.json(posts);
});

postsRouter.get("/:id", async (req, res) => {
  const user = await getUser(req);
  const id = Number(req.params.id);
  const post = await knex("posts").where({ id }).first();
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

postsRouter.post("/", async (req, res) => {
  const { body } = req.body;

  const user = await getUser(req);
  const [post] = await knex("posts")
    .insert({ body, userId: user.id })
    .returning("*");

  res.json(post);
});

postsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  const user = await getUser(req);
  const post = await knex("posts").where({ id });

  if (!post) return res.sendStatus(404);

  const [updatedPost] = await knex("posts")
    .where({ id })
    .update({ body })
    .returning("*");

  res.json(updatedPost);
});

postsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  const user = await getUser(req);
  const post = await knex("posts").where({ id });

  if (!post) return res.sendStatus(404);

  await knex("posts").where({ id }).delete();

  res.sendStatus(202);
});

module.exports = { postsRouter };
