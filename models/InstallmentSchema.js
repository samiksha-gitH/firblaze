const mongoose = require("mongoose")

const InstallmentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paidDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["paid", "pending", "overdue"],
    required: true,
    default: "pending",
  },
  receiver: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ], // Array of strings to hold names of members for this installment
})

module.exports = mongoose.model("Installments", InstallmentSchema)
