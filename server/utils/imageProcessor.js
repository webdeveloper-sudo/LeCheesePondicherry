const sharp = require("sharp");

/**
 * Image processing engine used before every upload.
 *
 * Any input format sharp can read (jpg, png, gif, svg, avif, tiff, webp, ...) comes out as
 * a WebP of at most MAX_BYTES:
 *   - WebP inputs already within the limit are passed through untouched.
 *   - Everything else is compressed and encoded as WebP, lowering the quality first and then
 *     the dimensions until the file fits.
 */

const MAX_BYTES = 1024 * 1024; // 1 MB
const MAX_DIMENSION = 2560; // Longest side; larger photos gain nothing on the web
const QUALITY_STEPS = [82, 74, 66, 58, 50];
const SCALE_STEP = 0.75;
const MAX_SCALE_ATTEMPTS = 8;

class ImageProcessingError extends Error {}

const toWebpName = (fileName) =>
  `${(fileName || `image_${Date.now()}`).replace(/\.[^./\\]+$/, "")}.webp`;

/**
 * @param {Buffer} buffer - Raw image bytes
 * @param {string} [fileName] - Original file name (extension is replaced with .webp)
 * @returns {Promise<{ buffer: Buffer, mimeType: string, fileName: string, width: number, height: number }>}
 */
const processImage = async (buffer, fileName) => {
  let meta;
  try {
    meta = await sharp(buffer, { animated: true }).metadata();
  } catch {
    throw new ImageProcessingError(
      `"${fileName || "image"}" is not a supported image (use JPG, PNG, WebP, GIF, AVIF, TIFF or SVG)`,
    );
  }

  const name = toWebpName(fileName);
  const animated = (meta.pages || 1) > 1;
  const frameHeight = meta.pageHeight || meta.height;

  if (meta.format === "webp" && buffer.length <= MAX_BYTES) {
    return { buffer, mimeType: "image/webp", fileName: name, width: meta.width, height: frameHeight };
  }

  const longest = Math.max(meta.width, frameHeight);
  let scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;

  for (let attempt = 0; attempt < MAX_SCALE_ATTEMPTS; attempt++) {
    const width = Math.max(1, Math.round(meta.width * scale));
    let lastSize = 0;

    for (const quality of QUALITY_STEPS) {
      let pipeline = sharp(buffer, { animated });
      if (!animated) pipeline = pipeline.rotate(); // Apply EXIF orientation before metadata is dropped
      const output = await pipeline
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toBuffer({ resolveWithObject: true });

      if (output.data.length <= MAX_BYTES) {
        console.log(
          `🗜️ ${fileName || "image"}: ${(buffer.length / 1024).toFixed(0)}KB ${meta.format} → ` +
            `${(output.data.length / 1024).toFixed(0)}KB webp (${output.info.width}x${output.info.height}, q${quality})`,
        );
        return {
          buffer: output.data,
          mimeType: "image/webp",
          fileName: name,
          width: output.info.width,
          height: output.info.height,
        };
      }

      lastSize = output.data.length;
      // Far over the limit: lowering quality won't get there, shrink the dimensions instead
      if (lastSize > MAX_BYTES * 2) break;
    }

    // File size scales roughly with pixel count, so jump straight to an estimated fit
    scale *= Math.min(SCALE_STEP, Math.sqrt(MAX_BYTES / lastSize) * 0.95);
  }

  throw new ImageProcessingError(`"${fileName || "image"}" could not be compressed under 1 MB`);
};

module.exports = { processImage, ImageProcessingError, MAX_BYTES };
