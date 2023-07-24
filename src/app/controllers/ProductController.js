const Product = require("../models/Product");
const { multipleMongooseToObject } = require("../../util/mongoose");

class ProductController {
  //get list
  index(req, res, next) {
    Product.find({})
      .then((products) => {
        res.json({ products });
      })
      .catch(next);
  }

  //get product by id
  getProductById(req, res, next) {
    const productId = req.params.id;
    Product.findById(productId)
      .then((product) => {
        res.json({ product });
      })
      .catch(next);
  }

  // PUT /courses/:id
  update(req, res, next) {
    const productId = req.params.id;
    const updateData = req.body;

    Product.findByIdAndUpdate(productId, updateData, { new: true })
      .then((product) => {
        if (!product) {
          throw new Error("Product not found");
        }
        res.json({ product });
      })
      .catch(next);
  }
}

module.exports = new ProductController();
