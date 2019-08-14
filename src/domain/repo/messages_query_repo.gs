var MessagesQueryRepo = function(token, channelId) {
  this.adapter = new SlackAdapter(token);
  this.channelId = channelId;
}

MessagesQueryRepo.prototype.findMessages = function(fromDate, toDate) {
  log_debug('MessagesQueryRepo.findMessages start');

  var from = clearTime(fromDate);
  var to = clearTime(toDate);

  var res = this.adapter.fetchMessages(this.channelId, from, to);
  var messages = this.parse(res);

  log_debug('MessagesQueryRepo.findMessages end');
  return messages;
}


// slack-api/response/messages -> Messages
MessagesQueryRepo.prototype.parse = function(res) {
  var messages = new Messages();
  for (var idx in res) {　messages.push(this.parseMessage(res[idx]));　}
  return messages;
}
// slack-api/response/messages/message -> Message
MessagesQueryRepo.prototype.parseMessage = function(res) {
  return new Message(
    res.client_msg_id,
    res.ts,
    res.thread_ts,
    res.type,
    res.user,
    res.text,
    res.is_starred,
    res.pinned_to,
    res.reactions,
    res.files,
    res.attachments
  );
}


//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_MessagesQueryRepo() {
  LOG_LEVEL = LOG_LEVEL_DEBUG;

  var botToken = ScriptProperties.getProperty('SlackBotToken');
//  var channelId = 'CBYRTHRL2'; // #random
//  var channelId = 'GF10NQT8R'; // #private_test
  var channelId = 'CAH84NHPZ'; // #tweet_to_me
  
  var query = new MessagesQueryRepo(botToken, channelId);
  var messages = query.findMessages(new Date('2019-01-01'), new Date('2019-08-15'));

  log_debug('messages.length: ' + messages.length());
}
