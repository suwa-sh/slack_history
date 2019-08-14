var Members = function() {
  this._list = [];
}

Members.prototype.toString = function() {
  return JSON.stringify(this._list);
}

Members.prototype.push = function(message) {
  return this._list.push(message);
}

Members.prototype.name = function(id) {
  for (var idx in this._list) {
    var member = this._list[idx];
    if (id == member.id) { return member.name; }
  }
}
