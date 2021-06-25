const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.SQL_USER || "test",
  host: process.env.SQL_ADDR || "localhost",
  database: process.env.SQL_DB || "test",
  password: process.env.SQL_PASS || "test",
  port: process.env.SQL_PORT || 5432,
});

const getClientByID = (id) => {
  pool.query("SELECT * FROM clients where id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    return results;
  });
};

const addPayment = (payment_attr) => {
  pool.query(
    "INSERT INTO payments (price,subject,clientid,txid) VALUES ($1, $2, $3)",
    [
      payment_attr.price,
      payment_attr.subject,
      payment_attr.clientid,
      payment_attr.txid,
    ],
    (error) => {
      if (error) {
        throw error;
      }
    }
  );
};

module.exports = {
  getClientByToken,
  addPayment,
};
