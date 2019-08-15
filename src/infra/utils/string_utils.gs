function forwardMatch(string, keyword) {
  return string.substr(0, keyword.length) == keyword;
}

function isEmpty(value) {
  if (value === undefined || value === null) { return true; }
  if (value === "") { return true; }

  return false;
};