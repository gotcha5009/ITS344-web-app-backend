const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyerSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creationDate: { type: Date, default: Date.now },
  isRestricted: { type: Boolean },
});

const Buyers = mongoose.model("Buyer", BuyerSchema);
module.exports = Buyers;
