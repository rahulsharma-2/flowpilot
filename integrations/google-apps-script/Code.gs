const FLOWPILOT = Object.freeze({
  headers: [
    'Received At',
    'Name',
    'Email',
    'Service',
    'Description',
    'Submission ID',
    'Email Sent At',
  ],
  notificationEmail: 'flowpilotautomation19@gmail.com',
  sheetName: 'Enquiries',
});

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    if (!lock.tryLock(5000)) return jsonResponse_({ ok: false });

    const input = parseInput_(event);
    const configuredSecret = PropertiesService.getScriptProperties().getProperty(
      'FLOWPILOT_SHARED_SECRET',
    );

    if (!configuredSecret || input.secret !== configuredSecret) {
      return jsonResponse_({ ok: false });
    }

    const enquiry = validateEnquiry_(input);
    if (!enquiry) return jsonResponse_({ ok: false });

    const sheet = getEnquiriesSheet_();
    const existingRow = findSubmissionRow_(sheet, enquiry.submissionId);

    if (existingRow && sheet.getRange(existingRow, 7).getValue()) {
      return jsonResponse_({ ok: true, duplicate: true });
    }

    const row = existingRow || appendEnquiry_(sheet, enquiry);
    sendNotification_(enquiry);
    sheet.getRange(row, 7).setValue(new Date());

    return jsonResponse_({ ok: true, duplicate: Boolean(existingRow) });
  } catch (_error) {
    return jsonResponse_({ ok: false });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function setup() {
  const secret = PropertiesService.getScriptProperties().getProperty(
    'FLOWPILOT_SHARED_SECRET',
  );
  if (!secret || secret.length < 32) {
    throw new Error('Set a FLOWPILOT_SHARED_SECRET script property first.');
  }

  getEnquiriesSheet_();
}

function parseInput_(event) {
  if (!event || !event.postData || !event.postData.contents) return {};

  try {
    return JSON.parse(event.postData.contents);
  } catch (_error) {
    return {};
  }
}

function validateEnquiry_(input) {
  const value = (key, maximum) =>
    typeof input[key] === 'string'
      ? input[key].trim().slice(0, maximum)
      : '';

  const enquiry = {
    submissionId: value('submissionId', 36),
    name: value('name', 100),
    email: value('email', 254),
    service: value('service', 100),
    description: value('description', 4000),
  };

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      enquiry.submissionId,
    ) ||
    !enquiry.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email) ||
    !enquiry.service ||
    enquiry.description.length < 20
  ) {
    return null;
  }

  return enquiry;
}

function getEnquiriesSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open this script from a Google Sheet.');

  let sheet = spreadsheet.getSheetByName(FLOWPILOT.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(FLOWPILOT.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FLOWPILOT.headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FLOWPILOT.headers.length).setFontWeight('bold');
  }

  return sheet;
}

function findSubmissionRow_(sheet, submissionId) {
  if (sheet.getLastRow() < 2) return 0;

  const match = sheet
    .getRange(2, 6, sheet.getLastRow() - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();

  return match ? match.getRow() : 0;
}

function appendEnquiry_(sheet, enquiry) {
  sheet.appendRow([
    new Date(),
    safeCell_(enquiry.name),
    safeCell_(enquiry.email),
    safeCell_(enquiry.service),
    safeCell_(enquiry.description),
    enquiry.submissionId,
    '',
  ]);

  return sheet.getLastRow();
}

function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function sendNotification_(enquiry) {
  MailApp.sendEmail({
    to: FLOWPILOT.notificationEmail,
    replyTo: enquiry.email,
    subject: `New FlowPilot enquiry: ${enquiry.service}`,
    body: [
      'A new enquiry was submitted on flowpilotautomation.in.',
      '',
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Service: ${enquiry.service}`,
      '',
      'Project description:',
      enquiry.description,
    ].join('\n'),
  });
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
