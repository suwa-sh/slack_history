var Message = function(
  client_msg_id,
  ts,
  thread_ts,
  type,
  user,
  text,
  is_starred,
  pinned_to,
  reactions,
  files,
  attachments) {

  this.client_msg_id = client_msg_id;
  this.ts = ts;
  this.thread_ts = thread_ts;
  this.type = type;
  this.user = user;
  this.text = text;
  this.is_starred = is_starred;
  this.pinned_to = pinned_to; // string[]
  this.reactions = [];
  this.files = [];
  this.attachments = [];

  // reactions
  for (var idx in reactions) {
    var reaction = new Reaction(reactions[idx].name, reactions[idx].count, reactions[idx].users);
    this.reactions.push(reaction);
  }

  // files
  for (var idx in files) {
    var file = new File(files[idx].name, files[idx].mimetype, files[idx].url_private, files[idx].permalink);
    this.files.push(file);
  }
  
  // attachments
  for (var idx in attachments) {
    var attachment = new Attachment(attachments[idx].ts, attachments[idx].pretext, attachments[idx].text, attachments[idx].footer);
    this.attachments.push(attachment);
  }
}

Message.prototype.toString = function() {
  return JSON.stringify(this);
}

Message.prototype.isStarred = function() {
  if (! this.is_starred) { return false; }
  return true;
}
Message.prototype.isPinned = function() {
  if (this.pinned_to == null) { return false; }
  if (this.pinned_to.length == 0) { return false; }
  return true;
}
Message.prototype.reactionCount = function() {
  if (this.reactions == null) { return 0; }
  return this.reactions.length;
}
Message.prototype.fileCount = function() {
  if (this.files == null) { return 0; }
  return this.files.length;
}
Message.prototype.attachmentCount = function() {
  if (this.attachments == null) { return 0; }
  return this.attachments.length;
}
