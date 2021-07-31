require("dotenv").config();

const express = require("express");

const services = require("./services");

const app = express();

const multer = require("multer");
const upload = multer({
  dest: "data/",
  limits: { fieldSize: 10 * 1024 * 1024 },
});

app.use(express.urlencoded({ extended: true }));

app.use(upload.array());

const cronJobScheduler = require("./cronjobs");

cronJobScheduler();

app.use(services);

app.listen(process.env.PORT || 8081, process.env.BIND || "0.0.0.0");
