const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const Product = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

//Add Plugin
Product.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Product", Product);
