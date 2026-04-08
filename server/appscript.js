/**
 * LE CHEESE PONDICHERRY - GOOGLE APPS SCRIPT
 * Bypasses Render's SMTP blocks by sending emails via HTTP (Port 443).
 * Also handles product image uploads to Google Drive.
 */

const DEFAULT_FOLDER_ID = "1rpfgKKLgWyvdD6TztCXMsovq1gQ4MUdW";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respond({ success: false, message: "Empty request body" });
    }

    const data = JSON.parse(e.postData.contents);
    let action = data.action;
    
    // Make action robust: trim and uppercase
    if (action) {
      action = action.toString().trim().toUpperCase();
    }

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
          message: "Invalid action received."
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
  try {
    const folderId = data.folderId || DEFAULT_FOLDER_ID;
    const fileName = data.fileName || "product_image_" + new Date().getTime();
    const mimeType = data.mimeType || "image/jpeg";
    const base64Data = data.base64Data;

    if (!base64Data) {
      return respond({ success: false, message: "Missing base64Data" });
    }

    const folder = DriveApp.getFolderById(folderId);
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      mimeType,
      fileName,
    );
    const file = folder.createFile(blob);

    let sharingError = null;
    try {
      // RESILIENCE FIX: Wrap sharing in try/catch to prevent crash if domain policies restrict public sharing
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (err) {
      sharingError = err.toString();
    }

    return respond({
      success: true,
      fileId: file.getId(),
      url: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000",
      directUrl: "https://lh3.googleusercontent.com/d/" + file.getId(),
      thumbnailUrl: "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w200",
      sharingError: sharingError
    });
  } catch (error) {
    return respond({ success: false, error: "Upload Step Error: " + error.toString() });
  }
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
    message: "Le Cheese Apps Script is running (Resilient Version)",
  });
}
