// Google Apps Script that appends each RSVP as a row in a Google Sheet.
//
// 1. Create a Google Sheet, then Extensions → Apps Script, and paste this file.
// 2. Project Settings → Script properties → add RSVP_SECRET (any long random string).
// 3. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
// 4. Put the web app URL in RSVP_WEBHOOK_URL and the secret in RSVP_WEBHOOK_SECRET.

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var secret = PropertiesService.getScriptProperties().getProperty("RSVP_SECRET");
  if (secret && body.secret !== secret) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false })).setMimeType(ContentService.MimeType.JSON);
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var record = body.record;
    var headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    Object.keys(record).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key);
      }
    });
    sheet.appendRow(headers.map(function (key) { return key in record ? record[key] : ""; }));
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
