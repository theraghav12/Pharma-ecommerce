const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Snapshot of price at purchase time
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    orderedAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date }
  });
  
  module.exports = mongoose.model("Order", orderSchema);
  