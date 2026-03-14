// ============================================================
// Le Pondicherry Cheese — General Enquiry Form AppScript
// Deploy as: Web App → Execute as: Me → Access: Anyone
// ============================================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // 🔁 Replace with your Sheet ID

const ADMIN_EMAILS = [
  'hello@lepondicheese.com',   // 🔁 Replace with actual admin email(s)
  'technicalhead@achariya.org',
].join(',');

// ─────────────────────────────────────────────────────────
// doGet — Required for CORS preflight requests from browser
// ─────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Le Cheese General Enquiry' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────
// doPost — Entry point called by the frontend fetch POST
// ─────────────────────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Empty request body');
    }

    const data = JSON.parse(e.postData.contents);

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new Error('Missing required fields: name, email, or message');
    }

    const referenceId = 'GEN-' + new Date().getTime();
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    appendToSheet(data, referenceId, timestamp);
    sendEmailNotification(data, referenceId, timestamp);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, referenceId: referenceId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doPost Error: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.message || 'Server error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────
// Append row using setValues + text format to avoid #ERROR
// on cells containing @ (email) or other special chars
// ─────────────────────────────────────────────────────────
function appendToSheet(data, referenceId, timestamp) {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  let sheet = ss.getSheetByName('General Enquiries');
  if (!sheet) sheet = ss.getSheets()[0];

  // Add header row only if the sheet is completely empty
  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setNumberFormat('@'); // Force text so @ doesn't trigger formula
    headerRange.setValues([[
      'Timestamp',
      'Reference ID',
      'Name',
      'Email',
      'Mobile',
      'Message',
      'Status'
    ]]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2C5530');
    headerRange.setFontColor('#FAB519');
  }

  const row = [
    timestamp,
    referenceId,
    data.name,
    data.email,     // ← This was causing #ERROR via appendRow
    data.mobile ? (data.dialCode + ' ' + data.mobile) : 'Not provided',
    data.message,
    'New'
  ];

  // KEY FIX: Use getRange + setValues with text format ('@')
  // instead of appendRow — prevents Google Sheets from
  // interpreting email addresses containing '@' as formulas
  const nextRow = sheet.getLastRow() + 1;
  const dataRange = sheet.getRange(nextRow, 1, 1, row.length);
  dataRange.setNumberFormat('@');   // Force all cells to plain text
  dataRange.setValues([row]);       // Write data as-is
}

// ─────────────────────────────────────────────────────────
// Send HTML email notification to admins
// ─────────────────────────────────────────────────────────
function sendEmailNotification(data, referenceId, timestamp) {
  const subject = 'New Enquiry | Le Cheese Pondicherry | ' + data.name;

  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">

  <div style="background-color: #2C5530; padding: 24px 32px;">
    <h2 style="color: #FAB519; margin: 0; font-size: 22px;">🧀 Le Pondicherry Cheese</h2>
    <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 14px;">New General Enquiry Received</p>
  </div>

  <div style="padding: 28px 32px; background-color: #FAF7F2;">
    <p style="color: #1A1A1A; font-size: 15px; margin-top: 0;">
      Hello Team,<br><br>
      A new enquiry has been submitted through the <b>Le Cheese Pondicherry Contact Form</b>.
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <tr style="background-color: #2C5530;">
        <td colspan="2" style="padding: 10px 16px; color: #FAB519; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">ENQUIRY DETAILS</td>
      </tr>
      <tr style="background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; width: 38%; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Reference ID</td>
        <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${referenceId}</td>
      </tr>
      <tr style="background-color: #fafafa;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Submitted On</td>
        <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${timestamp}</td>
      </tr>
      <tr style="background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Name</td>
        <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.name}</td>
      </tr>
      <tr style="background-color: #fafafa;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email</td>
        <td style="padding: 10px 16px; font-size: 13px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${data.email}" style="color: #2C5530;">${data.email}</a></td>
      </tr>
      <tr style="background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Mobile</td>
        <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; border-bottom: 1px solid #f0f0f0;">${data.mobile ? (data.dialCode + ' ' + data.mobile) : 'Not provided'}</td>
      </tr>
      <tr style="background-color: #fafafa;">
        <td style="padding: 10px 16px; font-weight: bold; color: #6B6B6B; font-size: 13px; vertical-align: top;">Message</td>
        <td style="padding: 10px 16px; color: #1A1A1A; font-size: 13px; white-space: pre-wrap;">${data.message}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; padding: 16px; border-left: 4px solid #C9A961; background: #fffbf0;">
      <p style="margin: 0; font-size: 13px; color: #6B6B6B;">
        Recorded in Google Sheet:<br>
        <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}" style="color: #2C5530; font-weight: bold;">📊 View General Enquiries Sheet</a>
      </p>
    </div>

    <p style="margin-top: 24px; font-size: 14px; color: #1A1A1A;">
      Regards,<br><b>Le Cheese Pondicherry — Website System</b>
    </p>
  </div>

  <div style="background-color: #1A1A1A; padding: 16px 32px; text-align: center;">
    <p style="color: #888; font-size: 11px; margin: 0;">This is an automated notification. Please do not reply.</p>
  </div>
</div>`;

  try {
    MailApp.sendEmail({
      to: ADMIN_EMAILS,
      subject: subject,
      body: 'A new general enquiry has been received. Please view this in HTML format.',
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log('Email error: ' + err.toString());
  }
}
