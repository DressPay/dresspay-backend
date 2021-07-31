const db = require("../../utils/database/LocalJSONDBUtil");
const message_struct = require("../../structures/message");
const evaluation = require("../../utils/verification/VerifyCondition");

const checker = (args) => {
  return "uid" in args;
};

const realChecker = (args) => {
  if (args.token != (process.env.AGENT_TOKEN || "123456")) return false;
  return true;
};

const action = (req, res) => {
  if (!realChecker(req.query)) {
    res.send(message_struct.genAPIMessage("invalid", false));
  } else {
    var tx = db.getTransactionByUID(req.query.uid);
    if (tx === undefined) {
    } else {
      res.send(
        message_struct.genAPIMessage({
          price: tx.price,
          approve: tx.approvelist.length,
          disapprove: tx.disapprovelist.length,
          condition: evaluation.calculateLeastCondition(tx.price),
          comment: tx.comment,
        })
      );
    }
  }
};

module.exports = {
  path: "/vote",
  method: "get",
  checker: checker,
  action: action,
};
