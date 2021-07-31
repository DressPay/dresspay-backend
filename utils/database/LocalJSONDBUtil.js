const struct_client = require("../../structures/client");
const struct_transaction = require("../../structures/transaction");
const driver = require("../storage/LocalJSONDBDriver");

const getClientByID = (id) => {
  if (id == "114514")
    return new struct_client(
      "114514",
      "Strategic Explorations Ltd",
      "e232fed1-6147-4ce0-a3b3-d501e039c2d2"
    );
  if (id == "0") return struct_client.getDefaultClient;
  else return null;
};

const getTransactionByUID = (uid) => {
  return driver.read().find((obj) => obj.uid === uid);
};

const voteTransaction = (uid, flag, voter) => {
  var data = driver.read();
  if (flag == 1)
    data[data.findIndex((x) => x.uid === uid)].approvelist.push(voter);
  else data[data.findIndex((x) => x.uid === uid)].disapprovelist.push(voter);
  driver.write(data);
  return data[data.findIndex((x) => x.uid === uid)];
};

const getCronCallackList = () => {
  return driver.read().filter((obj) => {
    return obj.status == 1 || (obj.status == 0 && obj.clientid == "0");
  });
};

const checkPayment = (payment_attr) => {
  return (
    driver.read().find((obj) => {
      return (
        obj.txid === payment_attr.out_trade_no &&
        obj.clientid === payment_attr.clientid
      );
    }) !== undefined
  );
};

const approvePayment = (uid) => {
  driver.write(
    driver.read().map((tx) => (tx.uid === uid ? { ...tx, status: 1 } : tx))
  );
};

const finishPayment = (uid, err = false) => {
  driver.write(
    driver
      .read()
      .map((tx) => (tx.uid === uid ? { ...tx, status: err ? 3 : 2 } : tx))
  );
};

const getGallery = (cnt) => {
  var result = driver.read().filter((obj) => {
    return obj.status === 2;
  });

  return result.slice(0, cnt).map((a) => {
    return { uid: a.uid, price: a.price };
  });
};

const addPayment = (payment_attr, filedata) => {
  var tx = new struct_transaction(
    payment_attr.price,
    payment_attr.subject,
    payment_attr.clientid,
    payment_attr.out_trade_no,
    payment_attr.notify_url,
    payment_attr.comment,
    filedata.uuid,
    filedata.hash
  );
  if (payment_attr.clientid == "0") tx.finish();
  driver.push(tx.toObject());
};

module.exports = {
  getClientByID,
  getTransactionByUID,
  voteTransaction,
  checkPayment,
  approvePayment,
  addPayment,
  finishPayment,
  getCronCallackList,
  getGallery,
};
