import {
  uploadBase64ToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "./cloudinary";

export const deleteFile = async (logoUrl) => {
  try {
    if (!logoUrl) return false;
    const publicId = getPublicIdFromUrl(logoUrl);
    if (publicId) {
      await deleteFromCloudinary(publicId);
      console.log("Old logo deleted from Cloudinary:", publicId);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting old logo:", error);
    throw error;
  }
};

export const saveFile = async (base64Data, hotelDb, oldLogoPath) => {
  try {
    // Delete old logo first
    if (oldLogoPath) {
      await deleteFile(oldLogoPath);
    }

    // Upload to Cloudinary
    const { url } = await uploadBase64ToCloudinary(base64Data, {
      folder: "wedding-mahaal/logos",
      fileName: "hotel-logo",
    });

    console.log("New logo saved to Cloudinary:", url);
    return url;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};
