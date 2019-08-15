var ReportService = function(token) {
  notEmpty('ReportService.token', token);
  
  this.adapter = new SlackAdapter(token);
}


var ReportCommand = function(channel, loadResponse) {
  notEmpty('ReportCommand.channel', channel);
  notEmpty('ReportCommand.loadResponse', loadResponse);

  this.channel = channel;
  this.loadResponse = loadResponse;
  this.timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm');
}

ReportService.prototype.report = function(command) {
  log_info("ReportService.report start");
  notNull('command', command);
  
  var message = this._getStateMessage(command.timestamp, command.loadResponse)
  this.adapter.postMessage(command.channel, message);
  
  log_info("ReportService.report start");
}

ReportService.prototype._getStateMessage = function(timestamp, loadResponse) {
  var startDate = Utilities.formatDate(loadResponse.startDate, 'Asia/Tokyo', 'yyyy-MM-dd');
  var endDate = Utilities.formatDate(loadResponse.endDate, 'Asia/Tokyo', 'yyyy-MM-dd');
  var messageCount = loadResponse.messageCount;

  var result = '';
  if (messageCount == 0) {
    result += '保存するメッセージはありませんでした。' + '\n';
    result += '\n';
    result += '```\n';
    result += '- 開始日: ' + startDate + '\n';
    result += '- 終了日: ' + endDate + '\n';
    result += '```\n';
    return result;
  }

  result += 'slackの履歴をspreadsheetに保存しました。' + '\n';
  result += '\n';
  result += '```\n';
  result += '- 開始日: ' + startDate + '\n';
  result += '- 終了日: ' + endDate + '\n';
  result += '- メッセージ数: ' + messageCount + '\n';
  result += '　　- スター　　　: ' + loadResponse.starredCount + '\n';
  result += '　　- ピン留め　　: ' + loadResponse.pinnedCount + '\n';
  result += '　　- リアクション: ' + loadResponse.reactionCount + '\n';
  result += '　　- 添付ファイル: ' + loadResponse.fileCount + '\n';
  result += '```\n';
  result += '\n';
  result += SpreadsheetApp.getActive().getUrl() + '\n';
  return result;
}



var ErrorReportCommand = function(channel, error) {
  notEmpty('ErrorReportCommand.channel', channel);
  notNull('ErrorReportCommand.error', error);

  this.channel = channel;
  this.error = error;
  this.timestamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm');
}

ReportService.prototype.errorReport = function(command) {
  log_info("ReportService.errorReport start");
  notNull('command', command);

  var message = command.timestamp + ' ERROR ' + command.error.message + '\n';
  if (! isNull(command.error.stack)) { message += command.error.stack + '\n'; }
  
  this.adapter.postMessage(command.channel, message);
  log_info("ReportService.errorReport end");
}


//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_report() {
  LOG_LEVEL = LOG_LEVEL_DEBUG;

try {
    new ReportService();
  } catch (e) { log_debug('error message:' + e); }

  try {
    new ReportCommand();
  } catch (e) { log_debug('error message:' + e); }
  try {
    new ReportCommand('string');
  } catch (e) { log_debug('error message:' + e); }

  var token = ScriptProperties.getProperty('SlackBotToken');
  var service = new ReportService(token);
  var command = new ReportCommand('#random');
  service.report(command);
  
  var errCommand = new ErrorReportCommand('#random', new Error('エラーメッセージ'));
  service.errorReport(errCommand);
}
