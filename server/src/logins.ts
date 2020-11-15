import { Router, Request, Response, request, NextFunction } from "express";
import { knex } from "./knex";
import bcrypt from "bcryptjs";
import short from "short-uuid";
import jwt from "jsonwebtoken";
import { jwtPrivateKey } from "../config.json";

export const loginsRouter = Router();
const translator = short();

export async function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtCookie = req.cookies.auth;
  let id: string;
  try {
    id = (jwt.verify(jwtCookie, jwtPrivateKey) as { id: string }).id;
  } catch (e) {
    res.sendStatus(401);
    return;
  }
  req.userId = translator.toUUID(id);
  next();
}

loginsRouter.post("/login", async function attemptLogin(
  req: Request,
  res: Response
) {
  const { userPasswordKey } = req.body;
  if (
    typeof userPasswordKey !== "string" ||
    userPasswordKey.indexOf(":") === -1
  )
    return res.sendStatus(401);
  const [userId, password] = userPasswordKey.split(":");

  const userUuid = translator.toUUID(userId);
  const { pw: passwordHash } = (await knex("passwords")
    .select("pw")
    .where({
      userId: userUuid,
    })
    .first()) as { pw: string };

  const didMatch = await bcrypt.compare(password, passwordHash);

  if (!didMatch) {
    res.sendStatus(401);
    return;
  }

  const jwtCookie = jwt.sign(
    { id: userId, timestamp: Date.now() },
    jwtPrivateKey
  );

  res.cookie("auth", jwtCookie).sendStatus(200);
});

loginsRouter.post("/register", async function createLogin(
  req: Request,
  res: Response
) {
  const { name, avatarUrl = null } = req.body;

  const passwordId = translator.generate();
  const passwordShortUuid = translator.generate();

  const passwordHash = await bcrypt.hash(passwordShortUuid, 10);

  await knex.transaction(async (trx) => {
    const [{ id: userId }] = await trx("users")
      .insert({ name, avatarUrl })
      .returning("*");

    console.log({ userId });

    await trx("passwords").insert({
      id: translator.toUUID(passwordId),
      pw: passwordHash,
      userId,
    });

    const userPasswordKey = `${translator.fromUUID(
      userId
    )}:${passwordShortUuid}`;

    res.json({ userPasswordKey });
  });
});

loginsRouter.post("/logout", async function logout(
  req: Request,
  res: Response
) {
  res.clearCookie("auth");
  res.sendStatus(202);
});

loginsRouter.get("/current-auth");
