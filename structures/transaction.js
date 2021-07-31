class Transaction {
  constructor(
    price,
    subject,
    clientid,
    txid,
    notify_url,
    comment,
    uid,
    hash
  ) {
    this.price = price;
    this.subject = subject;
    this.clientid = clientid;
    this.txid = txid;
    this.notify_url = notify_url;
    this.status = 0;
    this.uid = uid;
    this.hash = hash;
    this.comment = comment;
    this.approvelist = [];
    this.disapprovelist = [];
  }
  approve() {
    if (this.status == 0) this.status = 1;
  }
  finish() {
    if (this.status == 1) this.status = 2;
  }
  fromObject(obj) {
    this.price = obj.price;
    this.subject = obj.subject;
    this.clientid = obj.clientid;
    this.txid = obj.txid;
    this.notify_url = obj.notify_url;
    this.status = obj.status || 0;
    this.uid = obj.uid || null;
    this.hash = obj.hash;
    this.comment = obj.comment;
    this.approvelist = obj.approvelist;
    this.disapprovelist = obj.disapprovelist;
  }
  toObject() {
    return {
      price: this.price,
      subject: this.subject,
      clientid: this.clientid,
      txid: this.txid,
      notify_url: this.notify_url,
      uid: this.uid,
      hash: this.hash,
      status: this.status,
      comment: this.comment,
      approvelist: this.approvelist,
      disapprovelist: this.disapprovelist,
    };
  }
}

module.exports = Transaction;
