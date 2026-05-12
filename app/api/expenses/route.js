import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import Expenses from "../../../utils/model/financials/expenses/expensesSchema";
import { getModel } from "../../../utils/helpers/getModel";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "../../../utils/helpers/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await getHotelDatabase();
    const ExpensesModel = getModel("Expenses", Expenses);
    const formData = await request.formData();

    let receiptData = null;
    const receiptFile = formData.get("receipt");

    if (receiptFile && receiptFile.name) {
      const buffer = Buffer.from(await receiptFile.arrayBuffer());
      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/receipts",
        fileName: receiptFile.name,
      });

      receiptData = {
        url,
        filename: receiptFile.name,
      };
    }

    const expenseData = {
      amount: formData.get("amount"),
      category: formData.get("category"),
      expense: formData.get("expense"),
      description: formData.get("description"),
      date: new Date(formData.get("date")),
      receipt: receiptData,
      paymentType: formData.get("paymentType"),
      bank: formData.get("bank"),
      reference: formData.get("reference"),
    };

    const newExpense = new ExpensesModel(expenseData);
    await newExpense.save();

    return NextResponse.json(
      { success: true, expense: newExpense },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await getHotelDatabase();
    const ExpensesModel = getModel("Expenses", Expenses);

    if (id) {
      const expense = await ExpensesModel.findById(id);
      if (!expense) {
        return NextResponse.json(
          { success: false, message: "Expense not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, expense });
    }

    const expenses = await ExpensesModel.find().sort({ date: -1 });
    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await getHotelDatabase();
    const ExpensesModel = getModel("Expenses", Expenses);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const deletedExpense = await ExpensesModel.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Expense deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete expense" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await getHotelDatabase();
    const ExpensesModel = getModel("Expenses", Expenses);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 },
      );
    }

    const formData = await request.formData();

    // Get existing expense to handle receipt changes
    const existingExpense = await ExpensesModel.findById(id);
    if (!existingExpense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 },
      );
    }

    let receiptData = null;
    const receiptFile = formData.get("receipt");
    const keepExistingReceipt = formData.get("keepExistingReceipt");

    // Handle receipt file
    if (receiptFile && receiptFile.name) {
      // Delete old receipt from Cloudinary if exists
      if (existingExpense.receipt?.url) {
        const publicId = getPublicIdFromUrl(existingExpense.receipt.url);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch((err) =>
            console.error("Error deleting old receipt from Cloudinary:", err)
          );
        }
      }

      // Upload new receipt to Cloudinary
      const buffer = Buffer.from(await receiptFile.arrayBuffer());
      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/receipts",
        fileName: receiptFile.name,
      });

      receiptData = {
        url,
        filename: receiptFile.name,
      };
    } else if (keepExistingReceipt === "true") {
      receiptData = existingExpense.receipt;
    } else {
      // Delete existing receipt from Cloudinary if not keeping it
      if (existingExpense.receipt?.url) {
        const publicId = getPublicIdFromUrl(existingExpense.receipt.url);
        if (publicId) {
          await deleteFromCloudinary(publicId).catch((err) =>
            console.error("Error deleting receipt from Cloudinary:", err)
          );
        }
      }
    }

    const updateData = {
      amount: formData.get("amount"),
      category: formData.get("category"),
      expense: formData.get("expense"),
      description: formData.get("description"),
      date: new Date(formData.get("date")),
      receipt: receiptData,
      paymentType: formData.get("paymentType"),
      bank: formData.get("bank"),
      reference: formData.get("reference"),
    };

    const updatedExpense = await ExpensesModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    return NextResponse.json(
      { success: true, expense: updatedExpense },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update expense" },
      { status: 500 },
    );
  }
}
