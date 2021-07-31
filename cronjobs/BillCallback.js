var md5 = require("md5");
const db = require("../utils/database/LocalJSONDBUtil")
const axios = require("axios");
var FormData = require("form-data");

const requestCallBack = () => {
  var cronlist = db.getCronList();

  cronlist.forEach((tx) => {
    if (tx.clientid != "0") {
      token = db.getClientByID(tx.clientid).token;
      var msg = {
        out_trade_no: tx.txid,
        status: "SUCCESS",
        price: tx.price,
        uid: tx.uid,
      };
      msg = Object.keys(msg)
        .sort()
        .reduce((r, k) => ((r[k] = msg[k]), r), {});

      msgstr = "";

      Object.keys(msg).forEach((k) => {
        msgstr = msgstr + k + "=" + msg[k] + "&";
      });

      msgstr = msgstr.slice(0, -1) + token;
      msg["sign"] = md5(msgstr);
      var form = new FormData();
      Object.keys(msg).forEach((k) => {
        form.append(k, msg[k]);
      });
      axios
        .post(tx.notify_url, form, { headers: form.getHeaders() })
        .then((res) => {
          if (res.data.error == null) db.finishPayment(tx.uid);
          else finishPayment(tx.uid, true);
        });
    } else {
      db.finishPayment(tx.uid);
    }
  });
};
module.exports = { time: "* * * * *", job: requestCallBack };

if (require.main === module) {
  requestCallBack();
}
