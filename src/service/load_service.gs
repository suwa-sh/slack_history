var LoadService = function(token, channelId) {
  notEmpty('LoadService.token', token);
  notEmpty('LoadService.channelId', channelId);

  this.token = token;
  this.channelId = channelId;
  
  this.membersQueryRepo = new MembersQueryRepo(token);
  this.messagesQueryRepo = new MessagesQueryRepo(token, channelId);
}


var LoadCommand = function(startDate, endDate) {
  notEmpty('LoadCommand.startDate', startDate);
  notEmpty('LoadCommand.endDate', endDate);

  this.startDate = startDate;
  this.endDate = endDate;
}
var LoadResponse = function(command, messages) {
  this.startDate = command.startDate;
  this.endDate = command.endDate;
  this.messageCount = messages.length();
  this.starredCount = messages.starredCount();
  this.pinnedCount = messages.pinnedCount();
  this.reactionCount = messages.reactionCount();
  this.fileCount = messages.fileCount();
  this.attachmentCount = messages.attachmentCount();
}


LoadService.prototype.load = function(command) {
  log_info("LoadService.load start");
  notNull('command', command);

  var members = this.membersQueryRepo.findMembers();
  var messages = this.messagesQueryRepo.findMessages(command.startDate, command.endDate);
  if (messages.length() > 0) { messages.save(members); }

  log_info("LoadService.load end");
  return new LoadResponse(command, messages);
}



//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_LoadService() {
  LOG_LEVEL = LOG_LEVEL_DEBUG;
  
  var token = ScriptProperties.getProperty('SlackBotToken');
  var channelId = 'CBYRTHRL2';
  var service = new LoadService(token, channelId);

  var command = new LoadCommand(new Date('2019-08-14'), new Date('2019-08-15'));
  service.load(command);
}