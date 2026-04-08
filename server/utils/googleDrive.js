const axios = require("axios");

/**
 * Upload a file to Google Drive via Apps Script Web App
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - Mime type of the file
 * @param {string} base64Data - Base64 data of the file (without prefix)
 * @param {string} folderId - ID of the folder to upload to (optional)
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
const uploadFile = async (fileName, mimeType, base64Data, folderId) => {
  const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!APPS_SCRIPT_URL) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL is not defined in .env");
  }

  // Ensure base64 data doesn't have the data:image/...;base64, prefix
  const cleanBase64 = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;

  console.log(`📡 Sending ${fileName} to Apps Script proxy...`);
  console.log(`📁 Target Folder ID: ${folderId || "Proxy Default"}`);

  try {
    const response = await axios.post(APPS_SCRIPT_URL, {
      action: "UPLOAD_PRODUCT_IMAGE",
      fileName,
      mimeType,
      base64Data: cleanBase64,
      folderId: folderId || process.env.GOOGLE_DRIVE_FOLDER_ID,
    });

    if (response.data && response.data.success) {
      console.log(`✅ Upload successful: ${response.data.directUrl || response.data.url}`);
      return response.data.directUrl || response.data.url;
    } else {
      console.error(
        "❌ Apps Script Error:",
        response.data?.message || response.data?.error || "Unknown error",
      );
      console.log("📄 Full Apps Script Response:", JSON.stringify(response.data, null, 2));
      throw new Error(response.data?.message || "Apps Script Upload Failed");
    }
  } catch (error) {
    console.error("❌ Proxy Upload Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

/**
 * Delete a file (Not implementation for Apps Script yet, keeping signature)
 */
const deleteFile = async (fileId) => {
  console.warn("⚠️ deleteFile is not yet implemented via Apps Script proxy");
};

module.exports = {
  uploadFile,
  deleteFile,
};
