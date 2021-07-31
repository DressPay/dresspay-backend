const checker = (args) => {
  return true;
};

const realChecker = (args) => {
  if (
    !(
      "subject" in args &&
      "notify_url" in args &&
      "price" in args &&
      "return_url" in args &&
      "sign" in args &&
      "clientid" in args &&
      "out_trade_no" in args
    )
  )
    return false;
  if (isNaN(args.price)) return false;
  if (isNaN(args.clientid)) return false;
  return true;
};

const action = (req, res) => {
  if (!realChecker(req.body)) {
    res.redirect(
      (process.env.FRONTEND_URL || "https://dresspay.org") + "/error?type=param"
    );
  } else {
    var params = Object.keys(req.body)
      .map(function (key) {
        return key + "=" + encodeURIComponent(req.body[key]);
      })
      .join("&");
    res.redirect(
      (process.env.FRONTEND_URL || "https://dresspay.org") + "/pay?" + params
    );
  }
};

module.exports = {
  path: "/gateway",
  method: "post",
  checker: checker,
  action: action,
};
