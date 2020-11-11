import { Router, Request, Response } from "express";
import { knex } from "./knex";

export const usersRouter = Router();

const weakMapUsers = new WeakMap();
export async function getUser(req: Request) {
  if (!weakMapUsers.has(req)) {
    const user = await knex("users").first();
    weakMapUsers.set(req, user);
    return user;
  }
  return weakMapUsers.get(req);
}
usersRouter.get("/me", async (req: Request, res: Response) => {
  const user = await getUser(req);
  res.json(user);
});
