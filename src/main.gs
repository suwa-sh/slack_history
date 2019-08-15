var VERSION = 'v0.1.0';



function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menus = [
    { name: 'slack -> sheets', functionName: 'mainOndemandLoad' },
  ];
  ss.addMenu('【slack_history】', menus)
}



function mainOndemandLoad() {
  // 設定取得
  var settings = settings_load();
  notEmpty('loglevel',                 settings['loglevel']);
  notEmpty('slack.bot_token',          settings['slack.bot_token']);
  notEmpty('slack.load.channel_id',    settings['slack.load.channel_id']);
  notEmpty('slack.report.channel',     settings['slack.report.channel']);
  notEmpty('ondemand.load.start_date', settings['ondemand.load.start_date']);
  notEmpty('ondemand.load.end_date',   settings['ondemand.load.end_date']);
  
  LOG_LEVEL         = settings['loglevel'];
  var token         = settings['slack.bot_token'];
  var loadChannelId = settings['slack.load.channel_id'];
  var reportChannel = settings['slack.report.channel'];
  var startDate     = new Date(settings['ondemand.load.start_date']);
  var endDate       = new Date(settings['ondemand.load.end_date']);
  
  // load
  var loadService = new LoadService(token, loadChannelId);
  var loadCommand = new LoadCommand(startDate, endDate);
  var loadResponse = loadService.load(loadCommand);
  
  // report
  var reportService = new ReportService(token);
  var reportCommand = new ReportCommand(reportChannel, loadResponse);
  reportService.report(reportCommand);

  SpreadsheetApp.getActive().toast("処理が終了しました。");
}


function mainBatchLoad() {
  try {
    // 設定取得
    var settings = settings_load();
    notEmpty('loglevel',              settings['loglevel']);
    notEmpty('slack.bot_token',       settings['slack.bot_token']);
    notEmpty('slack.load.channel_id', settings['slack.load.channel_id']);
    notEmpty('slack.report.channel',  settings['slack.report.channel']);
  
    LOG_LEVEL         = settings['loglevel'];
    var token         = settings['slack.bot_token'];
    var loadChannelId = settings['slack.load.channel_id'];
    var reportChannel = settings['slack.report.channel'];
    var startDate     = getYesterday();
    var endDate       = new Date();

    // load
    var loadService = new LoadService(token, loadChannelId);
    var loadCommand = new LoadCommand(startDate, endDate);
    var loadResponse = loadService.load(loadCommand);
    
    // report
    var reportService = new ReportService(token);
    var reportCommand = new ReportCommand(reportChannel, loadResponse);
    reportService.report(reportCommand);

  } catch(e) {
    log_error(JSON.stringify(e));
    // error report
    var reportPort = new ReportPort(reportToken);
    var errorReportCommand = new ErrorReportCommand(reportChannel, e);
    reportPort.errorReport(errorReportCommand);
  }
}
