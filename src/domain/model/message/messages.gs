var Messages = function() {
  this._repo = new MessagesCommandRepo();
  this._list = [];
}

Messages.prototype.toString = function() {
  return JSON.stringify(this._list);
}

Messages.prototype.list = function() {
  // 用途が限定的なので、内部公開で済ませています。
  return this._list;
}

Messages.prototype.push = function(message) {
  return this._list.push(message);
}

Messages.prototype.length = function() {
  return this._list.length;
}

Messages.prototype.save = function(members) {
  this._repo.save(this, members);
}

Messages.prototype.starredCount = function() {
  var count = 0;
  for (var idx in this._list) {
    if (this._list[idx].isStarred()) { count++; }
  }
  return count;
}
Messages.prototype.pinnedCount = function() {
  var count = 0;
  for (var idx in this._list) {
    if (this._list[idx].isPinned()) { count++; }
  }
  return count;
}
Messages.prototype.reactionCount = function() {
  var count = 0;
  for (var idx in this._list) {
    count += this._list[idx].reactionCount();
  }
  return count;
}
Messages.prototype.fileCount = function() {
  var count = 0;
  for (var idx in this._list) {
    count += this._list[idx].fileCount();
  }
  return count;
}
Messages.prototype.attachmentCount = function() {
  var count = 0;
  for (var idx in this._list) {
    count += this._list[idx].attachmentCount();
  }
  return count;
}
