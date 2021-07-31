const cron = require("node-cron");

const init = () => {
  require("fs")
    .readdirSync(__dirname)
    .forEach(function (file) {
      var job_obj = require("./" + file);
      if (file !== "index.js") {
        cron.schedule(job_obj.time, job_obj.job);
      }
    });
};

module.exports = init;
