const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  options: Array,
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
