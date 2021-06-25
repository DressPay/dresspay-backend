const db = require("../utils/db-fake");
const sign = require("./sign");

const clientChecker = (args) => {
  return "clientid" in args;
};

const commonTransactionChecker = (args) => {
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
  return true;
};

const gatewayChecker = (args) => {
  if (!commonTransactionChecker(args)) return false;
  return true;
};

const payChecker = (args) => {
  if (!commonTransactionChecker(args)) return false;
  if (!args.photo.startsWith("data:image/")) return false;
  if (!db.getClientByID(args.clientid))
    if (sign.signMessage(args) != args.sign) return false;
  return true;
};

const demoChecker = (args) => {
  var processedArgs = args;
  if (
    !(
      "subject" in args &&
      "price" in args &&
      "return_url" in args &&
      "out_trade_no" in args
    )
  )
    return null;
  processedArgs.notify_url = "https://api.dresspay.org/demo/notify";
  processedArgs.clientid = "0";
  return processedArgs;
};

module.exports = {
  gatewayChecker,
  payChecker,
  clientChecker,
  demoChecker,
};
