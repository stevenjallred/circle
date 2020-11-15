// @ts-check
import express from "express";
import "express-async-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import { objectsRouter } from "./objects";
import cors from "cors";
import { loginsRouter, validateAuth } from "./logins";

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", loginsRouter);
app.use(validateAuth);

app.use("/objects", objectsRouter);

// app.use(express.static(path.join(__dirname, 'public')));

export default app;
