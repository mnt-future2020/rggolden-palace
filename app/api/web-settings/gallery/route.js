import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../../utils/config/hotelConnection";
import { GallerySchema } from "../../../../utils/model/webSettings/GallerySchema";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "../../../../utils/helpers/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await getHotelDatabase();
    const formData = await request.formData();
    const images = formData.getAll("images");

    const savedImages = [];
    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/gallery",
        fileName: image.name,
      });

      const galleryImage = new GallerySchema({
        url,
        name: image.name,
      });
      await galleryImage.save();
      savedImages.push(galleryImage);
    }

    return NextResponse.json({ success: true, images: savedImages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await getHotelDatabase();
    const images = await GallerySchema.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await getHotelDatabase();
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 },
      );
    }

    const image = await GallerySchema.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(image.url);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
      }
    }

    // Delete from database
    await GallerySchema.findByIdAndDelete(imageId);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
