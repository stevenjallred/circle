// @ts-check
import express from "express";
import "express-async-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import { postsRouter } from "./posts";
import { usersRouter } from "./users";
import cors from "cors";

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// app.use(express.static(path.join(__dirname, 'public')));

export default app;
