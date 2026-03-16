/**
 * LE CHEESE PONDICHERRY - GOOGLE APPS SCRIPT
 * Bypasses Render's SMTP blocks by sending emails via HTTP (Port 443).
 * Also handles product image uploads to Google Drive.
 * 
 * INSTRUCTIONS:
 * 1. Open Google Apps Script (script.google.com)
 * 2. Paste this code
 * 3. Deploy as Web App
 * 4. Execute as: Me
 * 5. Who has access: Anyone
 */

const DEFAULT_FOLDER_ID = "1rpfgKKLgWyvdD6TztCXMsovq1gQ4MUdW";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respond({ success: false, message: "Empty request body" });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Route actions based on the "action" field
    switch (action) {
      case "SEND_EMAIL":
        return handleEmail(data);

      case "UPLOAD_PRODUCT_IMAGE":
        return handleImageUpload(data);

      default:
        // Legacy support/Default to upload if action is missing but data is present
        if (data.base64Data) {
          return handleImageUpload(data);
        }
        return respond({
          success: false,
          message: "Invalid action: " + action,
        });
    }
  } catch (error) {
    return respond({ success: false, error: error.toString() });
  }
}

/**
 * Handles sending emails via Gmail (Bypasses Render SMTP Block)
 */
function handleEmail(data) {
  try {
    MailApp.sendEmail({
      to: data.to,
      cc: data.cc || "",
      subject: data.subject,
      htmlBody: data.html
    });
    return respond({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return respond({ success: false, message: "Apps Script Mail Error: " + error.toString() });
  }
}

/**
 * Handles product image uploads
 */
function handleImageUpload(data) {
  const folderId = data.folderId || DEFAULT_FOLDER_ID;
  const fileName = data.fileName || "product_image_" + new Date().getTime();
  const mimeType = data.mimeType || "image/jpeg";
  const base64Data = data.base64Data;

  if (!base64Data) {
    throw new Error("Missing base64Data");
  }

  const folder = DriveApp.getFolderById(folderId);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    mimeType,
    fileName,
  );
  const file = folder.createFile(blob);

  // Make file publicly viewable
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return respond({
    success: true,
    fileId: file.getId(),
    url: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000",
    directUrl: "https://lh3.googleusercontent.com/d/" + file.getId(),
    thumbnailUrl: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w200",
  });
}

/**
 * Helper to respond with JSON
 */
function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return respond({
    status: "active",
    message: "Le Cheese Apps Script is running",
  });
}
