const fs = require("fs");

if (!fs.existsSync("data_demo")) {
  fs.mkdirSync("data_demo", 0744);
  fs.writeFileSync("data_demo/db.json", "[]");
}

const getClientByID = (id) => {
  if (id == "114514")
    return {
      id: "114514",
      name: "Strategic Explorations Ltd",
      token: "e232fed1-6147-4ce0-a3b3-d501e039c2d2",
    };
  if (id == "0")
    return {
      id: "0",
      name: "DressPay",
      token: process.env.DEMO_UUID || "00000000-0000-0000-0000-000000000000",
    };
  else return null;
};

const getCronList = () => {
  var db = JSON.parse(fs.readFileSync("data_demo/db.json"));
  var result = db.filter((obj) => {
    return obj.status == 1 || (obj.status == 0 && obj.clientid == "0");
  });
  return result;
};

const checkPayment = (payment_attr) => {
  var db = JSON.parse(fs.readFileSync("data_demo/db.json"));
  var result = db.find((obj) => {
    return (
      obj.txid === payment_attr.out_trade_no &&
      obj.clientid === payment_attr.clientid
    );
  });
  return result !== undefined;
};

const finishPayment = (uid, err = false) => {
  var db = JSON.parse(fs.readFileSync("data_demo/db.json"));
  db = db.map((tx) => (tx.photo === uid ? { ...tx, status: err ? 3 : 2 } : tx));
  fs.writeFileSync("data_demo/db.json", JSON.stringify(db));
};

const getGallery = (cnt) => {
  var db = JSON.parse(fs.readFileSync("data_demo/db.json"));
  var result = db.filter((obj) => {
    return obj.status === 2;
  });

  return result.slice(0, cnt).map((a) => {
    return { photo: a.photo, price: a.price };
  });
};

const addPayment = (payment_attr, filedata) => {
  var db = JSON.parse(fs.readFileSync("data_demo/db.json"));
  db.push({
    price: payment_attr.price,
    subject: payment_attr.subject,
    clientid: payment_attr.clientid,
    txid: payment_attr.out_trade_no,
    notify_url: payment_attr.notify_url,
    photo: filedata.uuid,
    hash: filedata.hash,
    status: 0,
    comment: payment_attr.comment,
  });
  fs.writeFileSync("data_demo/db.json", JSON.stringify(db));
};

module.exports = {
  getClientByID,
  checkPayment,
  addPayment,
  finishPayment,
  getCronList,
  getGallery,
};
