const { Product } = require('../models/ProductModel');

exports.getProducts = async function (query, page, limit) {
  try {
    var products = await Product.find(query).sort({ name: 1 });
    return products;
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Category');
  }
};

exports.create = async function (newProduct) {
  try {
    if (
      await Product.findOne({
        name: newProduct.name,
        company: newProduct.company,
      })
    ) {
      return {
        success: false,
        message: 'Product already exists',
      };
    }

    createdProduct = await Product.create({
      name: newProduct.name,
      description: newProduct.description,
      productItems: newProduct.productItems,
      category: newProduct.category,
      company: newProduct.company,
    })
      .then((product) => {
        return {
          success: true,
          message: 'Create new product success',
          data: product,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: err,
        };
      });

    return createdProduct;
  } catch (e) {
    throw Error('Error while Creating Product');
  }
};

exports.delete = async function (productIdTodelete) {
  try {
    deletedProduct = await Product.findByIdAndDelete(productIdTodelete)
      .then((deletedProduct) => {
        return {
          success: true,
          message: 'Delete product successful',
          data: deletedProduct,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: err,
        };
      });
    return deletedproduct;
  } catch (e) {
    throw Error('Error while Deleting product');
  }
};

exports.update = async function (productToUpdate) {
  try {
    updatedProduct = await Product.findByIdAndUpdate(
      productToUpdate._id,
      productToUpdate,
      {
        new: true,
        useFindAndModify: false,
      }
    )
      .then((product) => {
        return {
          success: true,
          message: 'Update product successful',
          data: product,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: 'No product founded',
        };
      });
    return updatedProduct;
  } catch (e) {
    throw Error('Error while Updating Product');
  }
};

exports.genSKU = async function (productItem, productName) {
  const color = productItem.color ? productItem.color : 'NN';
  const size = productItem.size ? productItem.size : 'NN';
  const material = productItem.material ? productItem.material : 'NN';
  const sku =
    prouctName.substring(0, 3).toUpperCase() + color + size + material;
  return sku;
};
