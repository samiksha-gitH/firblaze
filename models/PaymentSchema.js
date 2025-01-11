const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  learner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Learner",
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  payment_plan: {
    type: String,
    required: true,
    enum: ["cash", "online", "finance"],
  },
  total_fee: {
    type: Number,
    required: true,
    min: 0,
  },
  installment: {
    type: [InstallmentSchema], // Embedding the Installment schema
    default: [],
  },
  amount_paid: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  balance_due: {
    type: Number,
    required: true,
    min: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Payment", PaymentSchema)
