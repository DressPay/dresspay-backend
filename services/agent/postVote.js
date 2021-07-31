const db = require("../../utils/database/LocalJSONDBUtil");
const message_struct = require("../../structures/message");
const evaluation = require("../../utils/verification/VerifyCondition");

const checker = (args) => {
  if (!("uid" in args && "voter" in args && "flag" in args && "token" in args))
    return false;
  return true;
};

const realChecker = (args) => {
  if (args.token != (process.env.AGENT_TOKEN || "123456")) return false;
  var tx = db.getTransactionByUID(args.uid);
  if (tx === undefined) return false;
  if (tx.status != 0) return false;
  if (args.voter in tx.approvelist) return false;
  if (args.voter in tx.disapprovelist) return false;
  return true;
};

const action = (req, res) => {
  if (!realChecker(req.body)) {
    res.send(message_struct.genAPIMessage("invalid", false));
  } else {
    var result = db.voteTransaction(
      req.body.uid,
      req.body.flag,
      req.body.voter
    );
    if (
      evaluation.calculateLeastCondition(result.price) <=
      result.approvelist.length - result.disapprovelist.length
    ) {
      db.approvePayment(result.uid);
    }
    res.send(
      message_struct.genAPIMessage({
        approve: result.approvelist.length,
        disapprove: result.disapprovelist.length,
        condition: evaluation.calculateLeastCondition(result.price),
      })
    );
  }
};

module.exports = {
  path: "/vote",
  method: "post",
  checker: checker,
  action: action,
};
