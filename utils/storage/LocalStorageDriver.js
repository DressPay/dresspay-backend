const fs = require("fs");
const md5 = require("md5");
const { v4: uuidv4 } = require("uuid");
const storeFile = (file) => {
  var uid = uuidv4();
  fs.writeFileSync("data/" + uid, file);
  return {
    uuid: uid,
    hash: md5(file),
  };
};
const storeFakeFile = (file) => {
  var uid = uuidv4();
  return {
    uuid: uid,
    hash: "0",
  };
};
const getFile = (uuid) => {
  try {
    return fs.readFileSync("data/" + uuid);
  } catch (e) {
    return null;
  }
};
module.exports = {
  storeFile,
  storeFakeFile,
  getFile,
};
