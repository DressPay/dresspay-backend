const storage = require("../../utils/storage/LocalStorageDriver");

const checker = (args) => {
  return true;
};

const action = (req, res) => {
  var image = storage.getFile(req.params.uuid);
  if (!image) {
    res.sendStatus(404);
    return true;
  }
  image = image.toString();
  image = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  res.setHeader("Content-Type", image[1]);
  res.send(Buffer.from(image[2], "base64"));
};

module.exports = {
  path: "/photo/:uuid",
  method: "get",
  checker: checker,
  action: action,
};
