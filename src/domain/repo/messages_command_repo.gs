var MessagesCommandRepo = function() {
  this.adapter = new HistorySheetAdapter();
}

MessagesCommandRepo.prototype.save = function(messages, members) {
  log_debug('MessagesCommandRepo.save start');

  var insertValues = [];
  for (var idx in messages.list()) {
    var message = messages.list()[idx];
    insertValues.push(this._getRowValue(message, members));
  }
  this.adapter.insertBatch(insertValues);

  log_debug('MessagesCommandRepo.save end');
}

MessagesCommandRepo.prototype._getRowValue = function(message, members) {
  var reaction_names = this._getReactionNames(message);
  var reaction_counts = this._getReactionCounts(message);
//  var reaction_users = this._getReactionUsers(message, members);
  var file_names = this._getFileNames(message);
  var file_mimetypes = this._getFileMimetypes(message);
  var file_url_privates = this._getFileUrlPrivates(message);
  var file_permalinks = this._getFilePermalinks(message);
  var attachment_tses = this._getAttachmentTses(message);
  var attachment_pretexts = this._getAttachmentPretexts(message);
  var attachment_texts = this._getAttachmentTexts(message);
  var attachment_footers = this._getAttachmentFooters(message);
  
  return this.adapter.getRowValue(
    this._undefined2empty(this._tsFormat(message.ts)),
    this._undefined2empty(message.client_msg_id),
    this._undefined2empty(message.ts),
    this._undefined2empty(message.thread_ts),
    this._undefined2empty(message.type),
    this._undefined2empty(members.name(message.user)),
    this._undefined2empty(message.text),
    this._undefined2empty(message.is_starred),
    this._undefined2empty(message.pinned_to),
    reaction_names,
    reaction_counts,
//    reaction_users,
    file_names,
    file_mimetypes,
    file_url_privates,
    file_permalinks,
    attachment_tses,
    attachment_pretexts,
    attachment_texts,
    attachment_footers
    );
}

MessagesCommandRepo.prototype._undefined2empty = function(value) {
  if (value != null) return value;
  return '';
}

MessagesCommandRepo.prototype._tsFormat = function(ts) {
  if (ts == null) return '';
  return Utilities.formatDate(new Date(ts * 1000), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm');
}

MessagesCommandRepo.prototype._getReactionNames = function(message) {
  var value = '';
  for (var idx in message.reactions) {　value += message.reactions[idx].name + String.fromCharCode(10); }
  return value;
}
MessagesCommandRepo.prototype._getReactionCounts = function(message) {
  var value = '';
  for (var idx in message.reactions) { value += message.reactions[idx].count + String.fromCharCode(10); }
  return value;
}
//MessagesCommandRepo.prototype._getReactionUsers = function(message) {
//  var value = '';
//  for (var idx in message.reactions) { value += message.reactions[idx].users + String.fromCharCode(10); }
//  return value;
//}


MessagesCommandRepo.prototype._getFileNames = function(message) {
  var value = '';
  for (var idx in message.files) { value += message.files[idx].name + String.fromCharCode(10); }
  return value;
}
MessagesCommandRepo.prototype._getFileMimetypes = function(message) {
  var value = '';
  for (var idx in message.files) { value += message.files[idx].mimetype + String.fromCharCode(10); }
  return value;
}
MessagesCommandRepo.prototype._getFileUrlPrivates = function(message) {
  var value = '';
  for (var idx in message.files) { value += message.files[idx].url_private + String.fromCharCode(10); }
  return value;
}
MessagesCommandRepo.prototype._getFilePermalinks = function(message) {
  var value = '';
  for (var idx in message.files) { value += message.files[idx].permalink + String.fromCharCode(10); }
  return value;
}


MessagesCommandRepo.prototype._getAttachmentTses = function(message) {
  var value = '';
  for (var idx in message.attachments) {
    if (message.attachments[idx].ts == null) { continue; }
    value = value + message.attachments[idx].ts + String.fromCharCode(10);
  }
  return value;
}
MessagesCommandRepo.prototype._getAttachmentPretexts = function(message) {
  var value = '';
  for (var idx in message.attachments) {
    if (message.attachments[idx].pretext == null) { continue; }
    value = value + message.attachments[idx].pretext + String.fromCharCode(10);
  }
  return value;
}
MessagesCommandRepo.prototype._getAttachmentTexts = function(message) {
  var value = '';
  for (var idx in message.attachments) {
    if (message.attachments[idx].text == null) { continue; }
    value = value + message.attachments[idx].text + String.fromCharCode(10);
  }
  return value;
}
MessagesCommandRepo.prototype._getAttachmentFooters = function(message) {
  var value = '';
  for (var idx in message.attachments) {
    if (message.attachments[idx].footer == null) { continue; }
    value = value + message.attachments[idx].footer + String.fromCharCode(10);
  }
  return value;
}



//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_MessagesCommandRepo() {
  LOG_LEVEL = LOG_LEVEL_DEBUG;

  var token = ScriptProperties.getProperty('SlackBotToken');
  var channelId = 'CAFEVPZ0Q' // #feed-it
//  var channelId = 'GF10NQT8R'; // #private_test
//  var channelId = 'CBYRTHRL2'; // #random
//  var channelId = 'CAH84NHPZ'; // #tweet_to_me
  
  var messagesQuery = new MessagesQueryRepo(token, channelId);
  var messages = messagesQuery.findMessages(new Date('2019-08-14'), new Date('2019-08-15'));
  
  var membersQuery = new MembersQueryRepo(token);
  var members = membersQuery.findMembers();

  var command = new MessagesCommandRepo();
  command.save(messages, members);

  log_debug('messages.length: ' + messages.length());
}
