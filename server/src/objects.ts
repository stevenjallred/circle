//@ts-check
import express, { Request, Response } from "express";
import { knex } from "./knex";

export const objectsRouter = express.Router();

objectsRouter.get("/", async (req: Request, res: Response) => {
  const offset = Number(req.query.offset) || 0;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const [{ count: total }] = await knex("objects").count();
  const meta = { offset, limit, total };

  const objects = await knex("objects")
    .orderBy("createdAt", "desc")
    .offset(offset)
    .limit(limit);
  res.json({ meta, data: objects });
});

objectsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const post = await knex("objects").where({ id }).first();
  if (post) {
    res.json(post);
  } else {
    res.sendStatus(404);
  }
});

objectsRouter.post("/", async (req: Request, res: Response) => {
  const { body } = req.body;

  const { userId } = req.cookies;
  const [post] = await knex("objects").insert({ body, userId }).returning("*");

  res.json(post);
});

objectsRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req.body;

  const post = await knex("objects").where({ id });

  if (!post) return res.sendStatus(404);

  const [updatedPost] = await knex("objects")
    .where({ id })
    .update({ body })
    .returning("*");

  res.json(updatedPost);
});

objectsRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await knex("objects").where({ id });

  if (!post) return res.sendStatus(404);

  await knex("objects").where({ id }).delete();

  res.sendStatus(202);
});
