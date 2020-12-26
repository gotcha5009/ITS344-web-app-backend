const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
});

// Creating our Product Schema with it's elements
const PaymentSchema = new Schema({
  paymentType: { type: String, required: true },
  isVerified: { type: String, required: true, default: false },
});

const OrderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' },
  payment: [PaymentSchema],
  orderDate: { type: Date, default: Date.now },
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  shipType: { type: String, required: true },
  trackNumber: { type: String, required: true },
  orderItems: [OrderItemSchema],
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
