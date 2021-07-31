const db = require("../../utils/database/LocalJSONDBUtil");
const storage = require("../../utils/storage/LocalStorageDriver");
const message_struct = require("../../structures/message");

const checker = (args) => {
  if (
    !(
      "subject" in args &&
      "notify_url" in args &&
      "price" in args &&
      "return_url" in args &&
      "sign" in args &&
      "clientid" in args &&
      "out_trade_no" in args
    )
  )
    return false;
  if (isNaN(args.price)) return false;
  if (isNaN(args.clientid)) return false;
  if (!args.photo.startsWith("data:image/")) return false;
  if (!db.getClientByID(args.clientid))
    if (sign.signMessage(args) != args.sign) return false;
  return true;
};

const action = (req, res) => {
  if (db.checkPayment(req.body)) {
    res.send(message_struct.genAPIMessage("duplicate", false));
  } else {
    var filedata =
      req.body["clientid"] == "0"
        ? storage.storeFakeFile(req.body.photo)
        : storage.storeFile(req.body.photo);
    db.addPayment(req.body, filedata);
    res.send(message_struct.genAPIMessage(filedata.uuid));
  }
};

module.exports = {
  path: "/pay",
  method: "post",
  checker: checker,
  action: action,
};
