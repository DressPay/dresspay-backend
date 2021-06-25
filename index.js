require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const cronJob = require("./cron");
const cors = require("cors");
const multer = require("multer");
const sign = require("./utils/sign");
const app = express();
const checker = require("./utils/checker");
const db = require("./utils/db-fake");
const storage = require("./storage/LocalStore");
const frontend_url = process.env.FRONTEND_URL || "https://dresspay.org";
const upload = multer({
  dest: "data/",
  limits: { fieldSize: 10 * 1024 * 1024 },
});

var corsOptions = {
  origin: process.env.FRONTEND_URL || "https://dresspay.org",
  optionsSuccessStatus: 200,
};

cron.schedule("* * * * *", cronJob.requestCallBack);

app.use(express.urlencoded({ extended: true }));

app.get("/client", cors(corsOptions), function (req, res) {
  if (!checker.clientChecker(req.query)) {
    res.send({ error: true, reason: "param" });
  } else {
    var clientinfo = db.getClientByID(req.query.clientid);
    return res.send(
      clientinfo
        ? {
            error: false,
            data: {
              id: clientinfo.id,
              name: clientinfo.name,
            },
          }
        : { error: true, reason: "notfound" }
    );
  }
});

app.post(
  "/demo/getsign",
  cors(corsOptions),
  upload.array(),
  function (req, res) {
    const sentrequest = checker.demoChecker(req.body);
    if (!sentrequest) {
      res.send({ error: true, reason: "param" });
    } else {
      res.send({
        error: false,
        data: {
          sign: sign.signMessage(
            sentrequest,
            process.env.DEMO_UUID || "00000000-0000-0000-0000-000000000000"
          ),
        },
      });
    }
  }
);

app.get("/photo/:uuid", function (req, res) {
  var image = storage.getFile(req.params.uuid).toString();
  if (!image) {
    res.sendStatus(404);
    return true;
  }
  image = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  res.setHeader("Content-Type", image[1]);
  res.send(Buffer.from(image[2], "base64"));
});

app.get("/gallery", cors(corsOptions), function (req, res) {
  return res.send({ error: false, data: db.getGallery(100) });
});

app.post(
  "/pay",
  cors(corsOptions),
  upload.single("photo"),
  function (req, res) {
    if (req.body["test"]) console.log("test request!");
    if (!checker.payChecker(req.body)) {
      res.send({ error: true, reason: "param" });
    } else if (db.checkPayment(req.body)) {
      res.send({ error: true, reason: "duplicate" });
    } else {
      var filedata = storage.storeFile(req.body.photo);
      db.addPayment(req.body, filedata);
      return res.send({ error: false, data: filedata.uuid });
    }
  }
);

app.post(["/gateway", "/testgateway"], function (req, res) {
  if (!checker.gatewayChecker(req.body)) {
    res.redirect(frontend_url + "/error?type=param");
  } else {
    var params = Object.keys(req.body)
      .map(function (key) {
        return key + "=" + encodeURIComponent(req.body[key]);
      })
      .join("&");
    if (req.path == "/testgateway") params = params + "&test=1";
    res.redirect(frontend_url + "/pay?" + params);
  }
});

app.get("/", function (req, res) {
  return res.send("Hello world");
});

app.listen(process.env.PORT || 8081, process.env.BIND || "0.0.0.0");
