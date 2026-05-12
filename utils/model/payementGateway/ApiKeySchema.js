import { Schema } from "mongoose";
const ApiKeySchema = new Schema(
  {
    apiKey: {
      type: String,
      trim: true,
      default: "",
    },
    secretKey: {
      type: String,
      trim: true,
      default: "",
    },
    // Which payment method is currently active for public display
    paymentMethod: {
      type: String,
      enum: ["upiQrCode", "upiId", "bankDetails", ""],
      default: "",
    },
    upiId: {
      type: String,
      trim: true,
    },
    upiQrCode: {
      type: String,
      trim: true,
    },
    // Bank Details
    accountHolderName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    bankBranch: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default ApiKeySchema;
