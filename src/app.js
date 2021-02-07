require("dotenv").config;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { v4: uuid } = require("uuid");
const { NODE_ENV } = require("./config");
const cardRouter = require("./card-router/card-router");
const listRouter = require("./list-router/list-router");

const app = express();
const morganConfiguration = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganConfiguration));
app.use(helmet());
app.use(cors());

// authorization
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_SERVER_ENDPOINT;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: "Unauthorized Request!" });
  }
  next();
});

app.use(cardRouter);
app.use(listRouter);

module.exports = app;
