require("dotenv").config();

const express = require("express");

const services = require("./services");

const app = express();

app.use(express.urlencoded({ extended: true }));

const cronJobScheduler = require("./cronjobs");

cronJobScheduler();

app.use(services);

app.listen(process.env.PORT || 8081, process.env.BIND || "0.0.0.0");
