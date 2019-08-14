var HistorySheetAdapter = function() {
  this.SHEETNAME = 'history';
  this.HEADER_ROW_COUNT = 2;

  this.sheet = SpreadsheetApp.getActive().getSheetByName(this.SHEETNAME);
}

HistorySheetAdapter.prototype.insertBatch = function(values) {
  // 先頭に追加
  var insertRowNum = this.HEADER_ROW_COUNT + 1;
  var count = values.length;
  this.sheet.insertRowsBefore(insertRowNum, count)
  this.sheet.getRange(insertRowNum, 1, count, this.sheet.getLastColumn()).setValues(values);
}

HistorySheetAdapter.prototype.getRowValue = function(
  timestamp,
  client_msg_id,
  ts,
  thread_ts,
  type,
  user,
  text,
  is_starred,
  pinned_to,
  reaction_name,
  reaction_count,
//  reaction_users,
  file_name,
  file_mimetype,
  file_url_private,
  file_permalink,
  attachment_ts,
  attachment_pretext,
  attachment_text,
  attachment_footer
  ) {

  var rowValue = [];
  rowValue.push(timestamp);
  rowValue.push(client_msg_id);
  rowValue.push(ts);
  rowValue.push(thread_ts);
  rowValue.push(type);
  rowValue.push(user);
  rowValue.push(text);
  rowValue.push(is_starred);
  rowValue.push(pinned_to);
  rowValue.push(reaction_name);
  rowValue.push(reaction_count);
//  rowValue.push(reaction_users);
  rowValue.push(file_name);
  rowValue.push(file_mimetype);
  rowValue.push(file_url_private);
  rowValue.push(file_permalink);
  rowValue.push(attachment_ts);
  rowValue.push(attachment_pretext);
  rowValue.push(attachment_text);
  rowValue.push(attachment_footer);
  return rowValue;
}





//--------------------------------------------------------------------------------------------------
// test
//--------------------------------------------------------------------------------------------------
function test_HistorySheetAdapter() {
  LOG_LEVEL = LOG_LEVEL_TRACE;
  var listSheetAdapter = new HistorySheetAdapter();
  
  var values = [];
  values.push(listSheetAdapter.getRowValue( 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ));
  values.push(listSheetAdapter.getRowValue( 2, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ));
  values.push(listSheetAdapter.getRowValue( 3, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ));
  listSheetAdapter.insertBatch(values);
}
