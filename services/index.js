const express = require("express");
const router = express.Router();

const cors = require("cors");

var corsOptions = {
  origin: process.env.FRONTEND_URL || "https://dresspay.org",
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));

require("fs")
  .readdirSync(__dirname)
  .forEach(function (file) {
    var rt_obj = require("./" + file);
    if (file !== "index.js") {
      router.use(rt_obj.path, rt_obj.router);
    }
  });

module.exports = router;
