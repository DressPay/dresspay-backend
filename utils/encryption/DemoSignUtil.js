var md5 = require("md5");

function signMessage(msg, token) {
  msg = Object.keys(msg)
    .sort()
    .reduce((r, k) => ((r[k] = msg[k]), r), {});

  msgstr = "";

  Object.keys(msg).forEach((k) => {
    if (k != "sign" && k != "test") msgstr = msgstr + k + "=" + msg[k] + "&";
  });

  msgstr = msgstr.slice(0, -1) + token;
  return md5(msgstr);
}
module.exports = {
  signMessage,
};
