import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Build an optimized Cloudinary URL with f_auto and q_auto transformations.
 * Converts: .../upload/v123/folder/file.png
 * Into:     .../upload/f_auto,q_auto/v123/folder/file.png
 */
function optimizeUrl(url) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}

/**
 * Sanitize a filename into a clean, SEO-friendly public_id.
 * e.g. "My Hotel Logo (2).png" → "my-hotel-logo-2"
 */
function toSeoPublicId(fileName) {
  if (!fileName) return undefined;
  const name = fileName.replace(/\.[^/.]+$/, ""); // remove extension
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumeric → hyphens
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer
 * @param {object} options - { folder, fileName, resource_type }
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(buffer, options = {}) {
  const { folder = "wedding-mahaal", fileName, resource_type = "auto" } = options;

  const uploadOptions = { folder, resource_type };

  // Use SEO-friendly public_id derived from the original filename
  const seoId = toSeoPublicId(fileName);
  if (seoId) {
    uploadOptions.public_id = `${seoId}-${Date.now()}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: optimizeUrl(result.secure_url),
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Upload a base64 data URI to Cloudinary.
 * @param {string} base64Data - Full data URI (data:image/png;base64,...)
 * @param {object} options - { folder, fileName }
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadBase64ToCloudinary(base64Data, options = {}) {
  const { folder = "wedding-mahaal", fileName } = options;

  const uploadOptions = { folder, resource_type: "auto" };

  const seoId = toSeoPublicId(fileName);
  if (seoId) {
    uploadOptions.public_id = `${seoId}-${Date.now()}`;
  }

  const result = await cloudinary.uploader.upload(base64Data, uploadOptions);

  return { url: optimizeUrl(result.secure_url), public_id: result.public_id };
}

/**
 * Delete a file from Cloudinary by its public_id.
 * @param {string} publicId
 * @returns {Promise<object>}
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Extract the public_id from a Cloudinary URL.
 * Handles URLs with or without f_auto,q_auto transformations.
 * e.g. https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto/v123/wedding-mahaal/gallery/file.jpg
 * returns "wedding-mahaal/gallery/file"
 */
export function getPublicIdFromUrl(url) {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    // Remove transformation params (f_auto,q_auto/) and version prefix (v1234567890/)
    const pathAfterUpload = parts[1]
      .replace(/^[a-z_,]+\//, "") // remove transformations like f_auto,q_auto/
      .replace(/^v\d+\//, "");    // remove version
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch {
    return null;
  }
}

export default cloudinary;
