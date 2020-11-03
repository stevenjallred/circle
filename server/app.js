// @ts-check
const express = require("express");
require("express-async-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { postsRouter } = require("./posts");
const { usersRouter } = require("./users");
const app = express();
exports.app = app;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
