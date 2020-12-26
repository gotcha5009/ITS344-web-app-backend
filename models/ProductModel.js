const mongoose = require('mongoose');
// var mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;
// var ProductItemSchema = require("./ProductItemModel.js").schema;
// const { CharacterSchema } = require(__dirname + "/CharacterModel.js").schema;

const ProductItemSchema = new Schema({
  sku: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String },
  material: { type: String },
  price: { type: Number, required: true },
  numberInStock: { type: Number, required: true },
  imageURL: { type: Array, required: true, default: [] },
  creationDate: { type: Date, default: Date.now },
});

// Creating our Product Schema with it's elements
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  imageURL: { type: Array, required: true, default: [] },
  creationDate: { type: Date, default: Date.now },
  productItems: [ProductItemSchema],
});

// ProductSchema.virtual("url").get(function () {
//   return "/product/" + this._id;
// });

// // will use mongoose-paginate plugin to retrieve data when make pagination
// ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', ProductSchema);
const ProductItem = mongoose.model('ProductItem', ProductItemSchema);

module.exports = {
  Product: Product,
  ProductItem: ProductItem,
};
