class Client {
  constructor(cid, alias, token) {
    this.cid = cid;
    this.alias = alias;
    this.token = token;
  }
  static get getDefaultClient() {
    return new Client(
      "0",
      "DressPay",
      process.env.DEMO_UUID || "00000000-0000-0000-0000-000000000000"
    );
  }
}

module.exports = Client;
