/**
 * Browser-side image preparation before upload.
 *
 * Shrinks images to ≤ 1 MB WebP so large photos fit in the request. The server runs the same
 * pipeline (server/utils/imageProcessor.js) on every upload, so anything this step can't handle
 * (animated GIFs, formats the browser can't decode or encode) is sent as-is and processed there.
 */

export const MAX_UPLOAD_BYTES = 1024 * 1024; // 1 MB
const MAX_DIMENSION = 2560;
const QUALITY_STEPS = [0.82, 0.74, 0.66, 0.58, 0.5];
const SCALE_STEP = 0.75;
const MAX_SCALE_ATTEMPTS = 8;

export interface PreparedImage {
  name: string;
  mimeType: string;
  data: string; // base64 without the data URL prefix
  dataUrl: string; // for previews
}

const readAsDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const toPrepared = async (blob: Blob, name: string): Promise<PreparedImage> => {
  const dataUrl = await readAsDataUrl(blob);
  return { name, mimeType: blob.type, data: dataUrl.split(",")[1], dataUrl };
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode failed"));
    };
    img.src = url;
  });

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

const webpName = (name: string) => `${name.replace(/\.[^.]+$/, "") || "image"}.webp`;

export async function prepareImageUpload(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image`);
  }

  // Already a small WebP, or an animated GIF the canvas would flatten: let the server handle it
  if ((file.type === "image/webp" && file.size <= MAX_UPLOAD_BYTES) || file.type === "image/gif") {
    return toPrepared(file, file.name);
  }

  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    return toPrepared(file, file.name); // e.g. HEIC in browsers that can't decode it
  }

  const naturalWidth = img.naturalWidth || 1;
  const naturalHeight = img.naturalHeight || 1;
  let scale = Math.min(1, MAX_DIMENSION / Math.max(naturalWidth, naturalHeight));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return toPrepared(file, file.name);

  for (let attempt = 0; attempt < MAX_SCALE_ATTEMPTS; attempt++) {
    canvas.width = Math.max(1, Math.round(naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(naturalHeight * scale));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let lastSize = 0;
    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, "image/webp", quality);
      // Browsers without WebP encoding return PNG; the server converts those instead
      if (!blob || blob.type !== "image/webp") return toPrepared(file, file.name);
      if (blob.size <= MAX_UPLOAD_BYTES) return toPrepared(blob, webpName(file.name));
      lastSize = blob.size;
      if (lastSize > MAX_UPLOAD_BYTES * 2) break;
    }

    scale *= Math.min(SCALE_STEP, Math.sqrt(MAX_UPLOAD_BYTES / lastSize) * 0.95);
  }

  return toPrepared(file, file.name);
}
