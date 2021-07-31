const db = require("../../utils/database/LocalJSONDBUtil");
const message_struct = require("../../structures/message");

const checker = (args) => {
  return true;
};

const action = (req, res) => {
  return res.send(db.getGallery(100));
};

module.exports = {
  path: "/gallery",
  method: "get",
  checker: checker,
  action: action,
};
