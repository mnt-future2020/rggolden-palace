import { NextResponse } from "next/server";
import Room from "../../../../utils/model/room/roomSchema";
import { getHotelDatabase } from "../../../../utils/config/hotelConnection";
import { getModel } from "../../../../utils/helpers/getModel";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "../../../../utils/helpers/cloudinary";

export async function GET(request, { params }) {
  const { roomId } = params;

  try {
    await getHotelDatabase();
    const RoomModel = getModel("Room", Room);

    const room = await RoomModel.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Error retrieving room:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { roomId } = params;

  try {
    await getHotelDatabase();
    const RoomModel = getModel("Room", Room);
    const formData = await request.formData();
    const type = formData.get("type");
    const updateData = {};

    // Common fields
    if (formData.has("name")) updateData.name = formData.get("name");
    if (formData.has("description"))
      updateData.description = formData.get("description");
    if (formData.has("igst")) updateData.igst = formData.get("igst");
    if (formData.has("price"))
      updateData.price = parseFloat(formData.get("price"));
    if (formData.has("size")) updateData.size = formData.get("size");

    // Type-specific fields
    if (type === "hall") {
      if (formData.has("capacity"))
        updateData.capacity = parseInt(formData.get("capacity"));
      if (formData.has("numberOfHalls"))
        updateData.numberOfHalls = parseInt(formData.get("numberOfHalls"));

      // Handle hall numbers update
      if (formData.has("hallNumbers")) {
        const numberOfHalls = parseInt(formData.get("numberOfHalls"));
        const newHallNumbers = JSON.parse(formData.get("hallNumbers"));

        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
          return NextResponse.json(
            { success: false, message: "Hall not found" },
            { status: 404 }
          );
        }

        // Create a map of existing hall numbers to their booking data
        const existingBookingsMap = new Map(
          existingRoom.hallNumbers?.map((hall) => [
            hall.number,
            hall.bookeddates,
          ]) || []
        );

        // Merge existing booking data with new hall numbers
        updateData.hallNumbers = newHallNumbers.map((hall) => ({
          number: hall.number,
          bookeddates: existingBookingsMap.get(hall.number) || [],
        }));

        updateData.numberOfHalls = numberOfHalls;
      }
    } else {
      // Existing room-specific fields handling
      if (formData.has("bedModel"))
        updateData.bedModel = formData.get("bedModel");
      if (formData.has("maxGuests"))
        updateData.maxGuests = parseInt(formData.get("maxGuests"));
      if (formData.has("additionalGuestCosts"))
        updateData.additionalGuestCosts = formData.get("additionalGuestCosts");
      if (formData.has("numberOfRooms"))
        updateData.numberOfRooms = parseInt(formData.get("numberOfRooms"));

      // Handle room numbers update
      if (formData.has("roomNumbers")) {
        const numberOfRooms = parseInt(formData.get("numberOfRooms"));
        const newRoomNumbers = JSON.parse(formData.get("roomNumbers"));

        const existingRoom = await RoomModel.findById(roomId);
        if (!existingRoom) {
          return NextResponse.json(
            { success: false, message: "Room not found" },
            { status: 404 }
          );
        }

        const existingBookingsMap = new Map(
          existingRoom.roomNumbers.map((room) => [
            room.number,
            room.bookeddates,
          ])
        );

        updateData.roomNumbers = newRoomNumbers.map((room) => ({
          number: room.number,
          bookeddates: existingBookingsMap.get(room.number) || [],
        }));

        updateData.numberOfRooms = numberOfRooms;
      }
    }

    // Update complementary foods handling
    updateData.complementaryFoods = formData.getAll("complementaryFoods");
    if (!formData.has("complementaryFoods")) {
      updateData.complementaryFoods = [];
    }

    if (formData.has("amenities")) {
      updateData.amenities = formData.getAll("amenities").map((amenity) => {
        const [icon, name] = amenity.split("-");
        return { icon, name };
      });
    }

    // Handle main image upload to Cloudinary
    const mainImageFile = formData.get("mainImage");
    let mainImageUrl = null;
    if (mainImageFile && mainImageFile.name) {
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/rooms/mainimage",
        fileName: mainImageFile.name,
      });
      mainImageUrl = url;
    }

    if (mainImageUrl) updateData.mainImage = mainImageUrl;

    // Handle thumbnail images upload to Cloudinary
    const thumbnailFiles = formData.getAll("thumbnailImages");
    const thumbnailImageUrls = [];
    for (const thumbnailFile of thumbnailFiles) {
      if (!thumbnailFile.name) continue;
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/rooms/thumbnailimages",
        fileName: thumbnailFile.name,
      });
      thumbnailImageUrls.push(url);
    }

    if (thumbnailImageUrls.length > 0)
      updateData.thumbnailImages = thumbnailImageUrls;

    const room = await RoomModel.findById(roomId);

    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found." },
        { status: 404 }
      );
    }

    const roomNumber = formData.get("roomNumber");
    const action = formData.get("action");
    const bookingNumber = formData.get("bookingNumber");

    // Handle booking updates based on room type
    if (action === "clear" && roomNumber && bookingNumber) {
      const isHall = room.type === "hall";
      const numbersArray = isHall ? room.hallNumbers : room.roomNumbers;

      const numberIndex = numbersArray.findIndex(
        (item) => item.number === roomNumber
      );

      if (numberIndex !== -1) {
        numbersArray[numberIndex].bookeddates = numbersArray[
          numberIndex
        ].bookeddates.filter(
          (booking) => booking.bookingNumber !== bookingNumber
        );

        const updateField = isHall ? "hallNumbers" : "roomNumbers";
        const updateResult = await RoomModel.findByIdAndUpdate(
          roomId,
          {
            $set: {
              [updateField]: numbersArray,
            },
          },
          { new: true }
        );

        if (!updateResult) {
          return NextResponse.json(
            {
              success: false,
              message: `Failed to update ${
                isHall ? "hall" : "room"
              } booking data`,
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          room: updateResult,
          message: "Booking cancelled and availability updated successfully",
        });
      }
    } else {
      // Add new booked dates
      if (bookingNumber && unavailableDates.length === 2) {
        room.roomNumbers[roomNumberIndex].bookeddates.push({
          bookingNumber: bookingNumber,
          checkIn: new Date(unavailableDates[0]),
          checkout: new Date(unavailableDates[1]),
          status: "booked",
        });
      }
    }

    // Update the room with all changes
    const updatedRoom = await RoomModel.findByIdAndUpdate(
      roomId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedRoom) {
      return NextResponse.json(
        { success: false, message: `${type} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        room: updatedRoom,
        message: `${type} Updated Successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { roomId } = params;

  try {
    await getHotelDatabase();
    const RoomModel = getModel("Room", Room);

    const roomToDelete = await RoomModel.findById(roomId);
    if (!roomToDelete) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    // Delete main image from Cloudinary
    if (roomToDelete.mainImage) {
      const publicId = getPublicIdFromUrl(roomToDelete.mainImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Error deleting main image from Cloudinary:", err)
        );
      }
    }

    // Delete thumbnail images from Cloudinary
    if (
      roomToDelete.thumbnailImages &&
      roomToDelete.thumbnailImages.length > 0
    ) {
      for (const thumbnailUrl of roomToDelete.thumbnailImages) {
        const publicId = getPublicIdFromUrl(thumbnailUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch((err) =>
            console.error(
              "Error deleting thumbnail image from Cloudinary:",
              err
            )
          );
        }
      }
    }

    await RoomModel.findByIdAndDelete(roomId);

    return NextResponse.json({
      success: true,
      message: "Room and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
