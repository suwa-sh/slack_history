var MembersQueryRepo = function(token) {
  this.adapter = new SlackAdapter(token);
}

MembersQueryRepo.prototype.findMembers = function() {
  log_debug('MembersQueryRepo.findMembers start');

  var res = this.adapter.fetchMembers();
  var members = this.parse(res);

  log_debug('MembersQueryRepo.findMembers end');
  return members;
}


// slack-api/response/members -> Members
MembersQueryRepo.prototype.parse = function(res) {
  var members = new Members();
  for (var idx in res) {　members.push(this.parseMember(res[idx]));　}
  return members;
}
// slack-api/response/members/member -> Member
MembersQueryRepo.prototype.parseMember = function(res) {
  // nameの優先度: display_name > name > id
  var name = res.profile.display_name;
  if (isEmpty(name)) { name = res.name; } 
  if (isEmpty(name)) { name = res.id; } 

  return new Member(res.id, name);
}


//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_MembersQueryRepo() {
  LOG_LEVEL = LOG_LEVEL_DEBUG;

  var botToken = ScriptProperties.getProperty('SlackBotToken');
  
  var query = new MembersQueryRepo(botToken);
  var members = query.findMembers();

  var test_id = 'U4WGS3EFQ';
  log_debug(test_id + ' : ' + members.name(test_id));
}
