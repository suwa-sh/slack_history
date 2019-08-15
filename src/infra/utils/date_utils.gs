function compareDate(date1, date2) {
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
}

function isBeforeDate(refDate, date) {
  if (compareDate(refDate, date) > 0) return true;
  return false;
}

function isAfterDate(refDate, date) {
  if (compareDate(date, refDate) > 0) return true;
  return false;
}


function clearTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

function toUnixtime(date) {
  return Math.floor(date.valueOf() / 1000 ).toString();
}

function getYesterday() {
  var now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
}
