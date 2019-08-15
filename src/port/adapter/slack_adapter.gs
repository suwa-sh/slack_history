var SlackAdapter = function(botToken) {
  notEmpty('SlackAdapter.botToken', botToken);
  
  this.botToken = botToken;
  this.MESSAGES_COUNT = 1000;
}


SlackAdapter.prototype.fetchMembers = function() {
  log_trace('SlackAdapter.fetchMembers start');

  var url = Utilities.formatString("https://slack.com/api/users.list?token=%s",this.botToken);

  log_trace("request url:" + url); 
  var res = UrlFetchApp.fetch(url);
  var json = JSON.parse(res);

  log_trace('SlackAdapter.fetchMembers end');
  return json.members;
}


SlackAdapter.prototype.fetchMessages = function(channelId, fromDate, toDate) {  
  log_trace('SlackAdapter.fetchMessages start');

  // channelIdの1文字目が、Gの場合 private channel = groups
  var isGroup = channelId.substring(0, 1) == "G";
  var endpoint = "channels.history";
  if (isGroup) { endpoint = "groups.history"; }

  var url = Utilities.formatString(
    "https://slack.com/api/" + endpoint + "?token=%s&channel=%s&oldest=%s&latest=%s&count=%s",
    this.botToken, channelId, toUnixtime(fromDate), toUnixtime(toDate), this.MESSAGES_COUNT);

  log_trace("request url:" + url); 
  var res = UrlFetchApp.fetch(url);
  var json = JSON.parse(res);

  log_trace('SlackAdapter.fetchMessages end');
  return json.messages;
}


/*
 * Slack bot apiを利用してメッセージを投稿します。
 *
 * @param channel チャンネル
 * @param message メッセージ
 */
SlackAdapter.prototype.postMessage = function(channel, message){
  log_trace('SlackAdapter.postMessage start');
  
  var url = 'https://slack.com/api/chat.postMessage';

  const payload = {
    "token" : this.botToken,
    "channel" : channel,
    "text" : message
  };
  const params = {
    "method" : "post",
    'contentType': 'application/x-www-form-urlencoded',
    "payload" : payload
  };

  log_trace("request url:" + url); 
  var res = UrlFetchApp.fetch(url, params);
  var json = JSON.parse(res);
  if (! json.ok) { throw new Error(json); }
  log_trace('SlackAdapter.postMessage end');
}


/*
 * Slack bot apiを利用して画像をアップロードします。
 *
 * @param channel チャンネル
 * @param title イメージタイトル
 * @param image イメージ
 * @param message メッセージ
 */
SlackAdapter.prototype.postImage = function(channel, title, image, message) {
  log_trace('SlackAdapter.postImage start');
  
  var url = 'https://slack.com/api/files.upload';
  
  var payload = {
    'token': this.botToken,
    'channels': channel,
    'initial_comment': message,
    'filename': title,
    'file': image
  };
  
  var params = {
    'method': 'post',
    'payload': payload
  };
  
  log_trace("request url:" + url); 
  var res = UrlFetchApp.fetch(url, params);
  var json = JSON.parse(res);
  if (! json.ok) { throw new Error(json); }
  log_trace('SlackAdapter.postImage end');
}



//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_SlackAdapter_fetchMessages() {
  LOG_LEVEL = LOG_LEVEL_TRACE;

  var botToken = ScriptProperties.getProperty('SlackBotToken');
  try {
    new SlackAdapter();
    throw new Error('fail');
  } catch(e) { log_debug('error message:' + e); }

  var adapter = new SlackAdapter(botToken);
  
  var channelId = 'CAH84NHPZ';
  var resMessages = adapter.fetchMessages(channelId, new Date('2019-01-01'), new Date('2019-08-15'));
  
  log_trace(resMessages);
}

function test_SlackAdapter_fetchMembers() {
  LOG_LEVEL = LOG_LEVEL_TRACE;

  var botToken = ScriptProperties.getProperty('SlackBotToken');
  var adapter = new SlackAdapter(botToken);
  
  var resMessages = adapter.fetchMembers();
  
  log_trace(resMessages);
}
