const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menu:     { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: [true, 'Customer name is required'] },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    orderType: {
      type: String,
      enum: ['dine-in', 'takeaway', 'delivery'],
      required: true,
    },
    deliveryAddress: { type: String, default: null },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'qris', 'e-wallet'], // tambah qris
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'diproses', 'selesai', 'dibatalkan'],
      default: 'pending',
    },
    notes: { type: String, maxlength: 300, default: '' },
    statusHistory: [{
      status:    String,
      timestamp: { type: Date, default: Date.now },
      note:      String,
    }],
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count   = await this.constructor.countDocuments();
    const date    = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    this.orderNumber = `KK-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
