const axios = require("axios");
const crypto = require("crypto");
const googleDrive = require("./googleDrive");

/**
 * Unified image upload service.
 *
 * IMAGE_UPLOAD_CDN selects the primary provider:
 *   - "cloudinary" → Cloudinary (signed REST upload)
 *   - "drive"      → Google Drive via Apps Script proxy (default)
 *
 * If the primary provider fails, the other configured provider is used as a backup,
 * so an outage on one side never drops an upload.
 */

const PROVIDERS = ["drive", "cloudinary"];

const getPrimaryProvider = () => {
  const value = (process.env.IMAGE_UPLOAD_CDN || "drive").trim().toLowerCase();
  if (!PROVIDERS.includes(value)) {
    console.warn(`⚠️ Unknown IMAGE_UPLOAD_CDN "${value}", falling back to "drive"`);
    return "drive";
  }
  return value;
};

/**
 * Read Cloudinary credentials from explicit vars, or parse CLOUDINARY_URL
 * (cloudinary://<api_key>:<api_secret>@<cloud_name>) as a fallback.
 */
const getCloudinaryConfig = () => {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    const match = process.env.CLOUDINARY_URL.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (match) {
      apiKey = apiKey || match[1];
      apiSecret = apiSecret || match[2];
      cloudName = cloudName || match[3];
    }
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: process.env.CLOUDINARY_FOLDER || "",
  };
};

const isCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(cloudName && apiKey && apiSecret);
};

const isDriveConfigured = () => Boolean(process.env.GOOGLE_APPS_SCRIPT_URL);

const stripBase64Prefix = (base64Data) =>
  base64Data.includes("base64,") ? base64Data.split("base64,")[1] : base64Data;

/**
 * Build a Cloudinary-safe public_id from the original file name.
 */
const toPublicId = (fileName) => {
  const base = (fileName || "image")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);
  return `${base}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

/**
 * Upload to Cloudinary using a signed request.
 * @returns {Promise<string>} secure URL of the uploaded image
 */
const uploadToCloudinary = async (fileName, mimeType, base64Data, subFolder) => {
  const { cloudName, apiKey, apiSecret, folder } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not defined in .env");
  }

  const cleanBase64 = stripBase64Prefix(base64Data);
  const targetFolder = [folder, subFolder].filter(Boolean).join("/");

  // Params included in the signature must be sorted alphabetically
  const params = {
    public_id: toPublicId(fileName),
    timestamp: Math.floor(Date.now() / 1000),
  };
  if (targetFolder) params.folder = targetFolder;

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  console.log(`☁️ Uploading ${fileName} to Cloudinary (${targetFolder || "root"})...`);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      ...params,
      file: `data:${mimeType || "image/jpeg"};base64,${cleanBase64}`,
      api_key: apiKey,
      signature,
    },
    { timeout: 60000, maxBodyLength: Infinity, maxContentLength: Infinity },
  );

  if (!response.data?.secure_url) {
    throw new Error("Cloudinary upload returned no URL");
  }

  console.log(`✅ Cloudinary upload successful: ${response.data.secure_url}`);
  return response.data.secure_url;
};

const uploadToDrive = (fileName, mimeType, base64Data, driveFolderId) =>
  googleDrive.uploadFile(fileName, mimeType, base64Data, driveFolderId);

/**
 * Upload an image through the provider chosen by IMAGE_UPLOAD_CDN,
 * falling back to the other provider if the primary one fails.
 *
 * Signature is compatible with googleDrive.uploadFile so callers can switch directly.
 *
 * @param {string} fileName - Original file name
 * @param {string} mimeType - Mime type (defaults to image/jpeg)
 * @param {string} base64Data - Base64 data, with or without data URL prefix
 * @param {string} [driveFolderId] - Google Drive folder (Drive provider only)
 * @param {Object} [options]
 * @param {string} [options.folder] - Sub-folder inside CLOUDINARY_FOLDER (e.g. "products")
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadFile = async (fileName, mimeType, base64Data, driveFolderId, options = {}) => {
  if (!base64Data) {
    throw new Error("Missing image base64 data");
  }

  const name = fileName || `image_${Date.now()}.jpg`;
  const type = mimeType || "image/jpeg";

  const uploaders = {
    cloudinary: {
      configured: isCloudinaryConfigured,
      upload: () => uploadToCloudinary(name, type, base64Data, options.folder),
    },
    drive: {
      configured: isDriveConfigured,
      upload: () => uploadToDrive(name, type, base64Data, driveFolderId),
    },
  };

  const primary = getPrimaryProvider();
  const order = [primary, ...PROVIDERS.filter((p) => p !== primary)];

  let lastError;
  for (const provider of order) {
    if (!uploaders[provider].configured()) {
      if (provider === primary) {
        console.warn(`⚠️ Primary image provider "${provider}" is not configured, trying backup`);
      }
      continue;
    }
    try {
      return await uploaders[provider].upload();
    } catch (error) {
      lastError = error;
      console.error(`❌ ${provider} upload failed for ${name}:`, error.response?.data?.error?.message || error.message);
    }
  }

  throw lastError || new Error("No image upload provider is configured");
};

module.exports = {
  uploadFile,
  uploadToCloudinary,
  uploadToDrive,
  getPrimaryProvider,
  isCloudinaryConfigured,
  isDriveConfigured,
};
