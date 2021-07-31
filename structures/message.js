class APIMessage {
  static genAPIMessage(payload, status = true) {
    if (status)
      return {
        error: false,
        data: payload,
      };
    else
      return {
        error: true,
        reason: payload,
      };
  }
}

module.exports = APIMessage;
