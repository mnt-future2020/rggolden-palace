import mongoose from "mongoose";

const crmSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    mobileno: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventStartDate: {
      type: Date,
      required: true,
    },
    eventEndDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    movedToBooking: {
      type: Boolean,
      default: false,
    },
    paymentReceipt: {
      type: String,
      default: "",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    selectedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    consentAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    consentTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Crm || mongoose.model("Crm", crmSchema);
