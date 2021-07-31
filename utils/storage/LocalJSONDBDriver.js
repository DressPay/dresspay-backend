const fs = require("fs");

const DB_DIR = process.env.STORAGE_LOCALJSONDB_DIR || "data";

const DB_FILE = DB_DIR + "/db.json";

const init = () => {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, 0744);
    fs.writeFileSync(DB_FILE, "[]");
  }
};

const read = () => {
  return JSON.parse(fs.readFileSync(DB_FILE));
};

const write = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data));
};

const push = (data) => {
  var db = read();
  db.push(data);
  write(db);
};

module.exports = {
  init,
  read,
  write,
  push,
};
