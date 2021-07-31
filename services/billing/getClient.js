const db = require("../../utils/database/LocalJSONDBUtil");
const message_struct = require("../../structures/message");

const checker = (args) => {
  return "clientid" in args;
};

const action = (req, res) => {
  var clientinfo = db.getClientByID(req.query.clientid);
  return res.send(
    clientinfo
      ? message_struct.genAPIMessage({
          cid: clientinfo.cid,
          alias: clientinfo.alias,
        })
      : message_struct.genAPIMessage("notfound", false)
  );
};

module.exports = {
  path: "/client",
  method: "get",
  checker: checker,
  action: action,
};
