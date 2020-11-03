const { Router } = require("express");
const { knex } = require("./knex");
const usersRouter = Router();

const weakMapUsers = new WeakMap();
async function getUser(req) {
  if (!weakMapUsers.has(req)) {
    const user = await knex("users").first();
    weakMapUsers.set(req, user);
    return user;
  }
  return weakMapUsers.get(req);
}
usersRouter.get("/me", async (req, res) => {
  const user = await getUser(req);
  res.json(user);
});

module.exports = { getUser, usersRouter };
