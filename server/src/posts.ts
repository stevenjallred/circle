//@ts-check
import express, { Request, Response } from "express";
import { getUser } from "./users";
import { knex } from "./knex";

export const postsRouter = express.Router();

postsRouter.get("/", async (req: Request, res: Response) => {
  const user = await getUser(req);
  const offset = Number(req.query.offset) || 0;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const [{ count: total }] = await knex("posts").count();
  const meta = { offset, limit, total };

  const posts = await knex("posts").orderBy("id").offset(offset).limit(limit);
  res.json({ meta, data: posts });
});

postsRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await getUser(req);
  const id = Number(req.params.id);
  const post = await knex("posts").where({ id }).first();
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

postsRouter.post("/", async (req: Request, res: Response) => {
  const { body } = req.body;

  const user = await getUser(req);
  const [post] = await knex("posts")
    .insert({ body, userId: user.id })
    .returning("*");

  res.json(post);
});

postsRouter.put("/:id", async (req: Request, res: Response) => {
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

postsRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.body;

  const user = await getUser(req);
  const post = await knex("posts").where({ id });

  if (!post) return res.sendStatus(404);

  await knex("posts").where({ id }).delete();

  res.sendStatus(202);
});
