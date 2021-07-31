const express = require("express");
const router = express.Router();

const message = require("../../structures/message");

require("fs")
  .readdirSync(__dirname)
  .forEach(function (file) {
    var rt_obj = require("./" + file);
    if (file !== "index.js") {
      switch (rt_obj.method) {
        case "post": {
          router.post(rt_obj.path, function (req, res) {
            if (!rt_obj.checker(req.body))
              res.send(message.genAPIMessage("param", false));
            else rt_obj.action(req, res);
          });
        }
        default:
          router.get(rt_obj.path, function (req, res) {
            if (!rt_obj.checker(req.query))
              res.send(message.genAPIMessage("param", false));
            else rt_obj.action(req, res);
          });
      }
    }
  });

module.exports = {
  path: "/demo",
  router: router,
};
