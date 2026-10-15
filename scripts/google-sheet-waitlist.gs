/**
 * Google Apps Script web app: appends waitlist submissions to this
 * spreadsheet. The Cloudflare Pages function (functions/api/waitlist.js)
 * POSTs { name, email, business, timestamp } JSON here.
 *
 * SETUP (one time, about 2 minutes):
 * 1. Open the target spreadsheet in a browser.
 * 2. Extensions -> Apps Script. Paste this whole file, save.
 * 3. Deploy -> New deployment -> type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL (ends in /exec) and set it as the
 *    SHEET_WEBAPP_URL environment variable in Cloudflare Pages.
 *
 * Expected sheet layout, row 1 headers:
 *   Timestamp | Name | Email | Business
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  let d = {};
  try {
    d = JSON.parse(e.postData.contents || '{}');
  } catch (_) {
    d = {};
  }
  sheet.appendRow([
    d.timestamp || new Date().toISOString(),
    d.name || '',
    d.email || '',
    d.business || '',
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Health check when the URL is opened in a browser. */
function doGet() {
  return ContentService.createTextOutput('waitlist web app ok')
    .setMimeType(ContentService.MimeType.TEXT);
}
