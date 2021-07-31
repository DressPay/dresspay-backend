const express = require("express");
const router = express.Router();

const message = require("../../structures/message");

router.get("/sysinfo", function (req, res) {
  return res.send(
    message.genAPIMessage({ version: process.env.API_VERSION || "UNKNOWN" })
  );
});

module.exports = {
  path: "/",
  router: router,
};
