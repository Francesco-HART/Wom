const CronJob = require("cron").CronJob;
const removeLogs = require("./cronJobs/removeLogs");
const removeRecordings = require("./cronJobs/removeRecordings");
const pushFailures = require("./cronJobs/pushFailure");

// remove old logs every day at 00:00
const jobRemoveLogs = new CronJob("00 00 00 * * *", () => {
  removeLogs();
});

// start cronjobs
jobRemoveLogs.start();
