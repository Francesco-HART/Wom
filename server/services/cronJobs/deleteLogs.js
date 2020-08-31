const Config = require("../../config");
const AddressLogs = require("../../models/actions/addressLogs");
const UserLogs = require("../../models/actions/userLogs");

async function removeLogs() {
  // get logs retention (in days)
  const dayExpLogs = 365;
  if (!dayExpLogs) return console.log("no logs retention found");
  // set date limit
  const date_limit = new Date(
    new Date().setDate(new Date().getDate() - dayExpLogs)
  );
  // delete groupLogs
  try {
    await AddressLogs.deleteMany({ date: { $lt: date_limit } });
  } catch (err) {
    console.log("Error logs groupLogs : ", err);
  }
  // delete userLogs
  try {
    await UserLogs.deleteMany({ date: { $lt: date_limit } });
  } catch (err) {
    console.log("Error logs userLogs : ", err);
  }
}

module.exports = removeLogs;
