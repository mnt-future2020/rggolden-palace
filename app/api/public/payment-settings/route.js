import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../../utils/config/hotelConnection";
import ApiKeySchema from "../../../../utils/model/payementGateway/ApiKeySchema";
import { getModel } from "../../../../utils/helpers/getModel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await getHotelDatabase();
    const ApiKeys = getModel("ApiKeys", ApiKeySchema);
    const keys = await ApiKeys.findOne().maxTimeMS(5000);

    const paymentMethod = keys?.paymentMethod || "";
    const upiId = keys?.upiId || "";
    const upiQrCode = keys?.upiQrCode || "";
    const accountHolderName = keys?.accountHolderName || "";
    const ifscCode = keys?.ifscCode || "";
    const bankBranch = keys?.bankBranch || "";

    const accountNumber = keys?.accountNumber || "";

    return NextResponse.json({
      paymentMethod,
      upiId,
      upiQrCode,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankBranch,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
      { status: 500 },
    );
  }
}
