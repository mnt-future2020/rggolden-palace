import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import { getWebSettings } from "../../../utils/model/webSettings/WebSettingsSchema";
import { uploadBase64ToCloudinary } from "../../../utils/helpers/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getHotelDatabase();
    const settings = await getWebSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await getHotelDatabase();
    const settings = await getWebSettings();
    const data = await request.json();

    if (data.heroSection) {
      // Handle base64 image if present
      if (
        data.heroSection.image &&
        data.heroSection.image.startsWith("data:image")
      ) {
        const { url } = await uploadBase64ToCloudinary(data.heroSection.image, {
          folder: "wedding-mahaal/web-settings",
          fileName: data.heroSection.title || "hero-section",
        });
        data.heroSection.image = url;
      }

      settings.heroSections.push(data.heroSection);
    }

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await getHotelDatabase();
    const settings = await getWebSettings();
    const data = await request.json();

    if (data.heroSectionId && data.heroSection) {
      const index = settings.heroSections.findIndex(
        (h) => h._id.toString() === data.heroSectionId,
      );
      if (index !== -1) {
        // Handle base64 image if present
        if (
          data.heroSection.image &&
          data.heroSection.image.startsWith("data:image")
        ) {
          const { url } = await uploadBase64ToCloudinary(
            data.heroSection.image,
            { folder: "wedding-mahaal/web-settings", fileName: data.heroSection.title || "hero-section" },
          );
          data.heroSection.image = url;
        }

        settings.heroSections[index] = {
          ...settings.heroSections[index],
          ...data.heroSection,
        };
      }
    }

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await getHotelDatabase();
    const settings = await getWebSettings();
    const { searchParams } = new URL(request.url);
    const heroSectionId = searchParams.get("heroSectionId");

    if (heroSectionId) {
      settings.heroSections = settings.heroSections.filter(
        (h) => h._id.toString() !== heroSectionId,
      );
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
