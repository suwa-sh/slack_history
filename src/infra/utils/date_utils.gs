function compareDate(dateString1, dateString2) {
  // string -> date にして比較
  var date1 = new Date(dateString1);
  var date2 = new Date(dateString2);
  
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
}

function isBeforeDate(refDateString, dateString) {
  if (isEmpty(dateString)) return false;
  if (compareDate(refDateString, dateString) > 0) return true;
  return false;
}

function isAfterDate(refDateString, dateString) {
  if (isEmpty(dateString)) return false;
  if (compareDate(dateString, refDateString) > 0) return true;
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
