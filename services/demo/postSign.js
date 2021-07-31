const signUtil = require("../../utils/encryption/DemoSignUtil");
const message_struct = require("../../structures/message");

const checker = (args) => {
  return (
    "subject" in args &&
    "price" in args &&
    "return_url" in args &&
    "out_trade_no" in args
  );
};

const action = (req, res) => {
  var sentreq = req.body;
  sentreq.notify_url = "https://api.dresspay.org/demo/notify";
  sentreq.clientid = "0";
  res.send(
    message_struct.genAPIMessage({
      sign: signUtil.signMessage(
        sentreq,
        process.env.DEMO_UUID || "00000000-0000-0000-0000-000000000000"
      ),
    })
  );
};

module.exports = {
  path: "/sign",
  method: "post",
  checker: checker,
  action: action,
};
