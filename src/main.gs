var VERSION = 'v0.2.0';



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
  notEmpty('loglevel',              settings['loglevel']);
  notEmpty('slack.bot_token',       settings['slack.bot_token']);
  notEmpty('slack.load.channel_id', settings['slack.load.channel_id']);
  notEmpty('slack.report.channel',  settings['slack.report.channel']);
  notEmpty('load.start_date',       settings['load.start_date']);
  notEmpty('load.end_date',         settings['load.end_date']);
  
  LOG_LEVEL         = settings['loglevel'];
  var token         = settings['slack.bot_token'];
  var loadChannelId = settings['slack.load.channel_id'];
  var reportChannel = settings['slack.report.channel'];
  var startDate     = new Date(settings['load.start_date']);
  var endDate       = new Date(settings['load.end_date']);
  
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


// 前回実行日〜当日
function mainBatchLoad() {
  try {
    // 設定取得
    var settings = settings_load();
    notEmpty('loglevel',              settings['loglevel']);
    notEmpty('slack.bot_token',       settings['slack.bot_token']);
    notEmpty('slack.load.channel_id', settings['slack.load.channel_id']);
    notEmpty('slack.report.channel',  settings['slack.report.channel']);
    notEmpty('load.end_date',         settings['load.end_date']);

    LOG_LEVEL         = settings['loglevel'];
    var token         = settings['slack.bot_token'];
    var loadChannelId = settings['slack.load.channel_id'];
    var reportChannel = settings['slack.report.channel'];
    var prevEndDate   = new Date(settings['load.end_date']);

    var startDate     = prevEndDate;
    var endDate       = new Date();

    // load
    var loadService = new LoadService(token, loadChannelId);
    var loadCommand = new LoadCommand(startDate, endDate);
    var loadResponse = loadService.load(loadCommand);
    
    // report
    var reportService = new ReportService(token);
    var reportCommand = new ReportCommand(reportChannel, loadResponse);
    reportService.report(reportCommand);
    
    // 対象期間の更新
    _settings_updateDateRange(startDate, endDate);

  } catch(e) {
    log_error(JSON.stringify(e));
    // error report
    var reportService = new ReportService(token);
    var errorReportCommand = new ErrorReportCommand(reportChannel, e);
    reportService.errorReport(errorReportCommand);
  }
}


function _settings_updateDateRange(startDate, endDate) {
  var startDateStr = Utilities.formatDate(startDate, 'Asia/Tokyo', 'yyyy-MM-dd');
  var endDateStr   = Utilities.formatDate(endDate,   'Asia/Tokyo', 'yyyy-MM-dd');

  var sheet = SpreadsheetApp.getActive().getSheetByName(DEFAULT_SHEETNAME_SETTINGS);
  sheet.getRange('C7').setValue(startDateStr);
  sheet.getRange('C8').setValue(endDateStr);
}

function _test_settings_updateDateRange() {
  var startDate = getYesterday();
  var endDate = new Date();
  _settings_updateDateRange(startDate, endDate);
}