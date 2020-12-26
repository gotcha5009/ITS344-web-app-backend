const { Product } = require('../models/ProductModel');
const ProductService = require('../services/productService');
const CategoryService = require('../services/categoryService');
// const User = require("../models/UsersModel");

// handle GET request at /api/product to get list of all products in stock
// exports.allProducts = (req, res) => {
//   let page = req.query.page || 1;
//   let perPage = parseInt(req.query.perPage) || 8;

//   Product.paginate(
//     { numberInStock: { $ne: 0 } },
//     { sort: { creationDate: -1 }, page: page, limit: perPage },
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(400).json({ message: "Couldn't find products" });
//       } else {
//         res
//           .status(200)
//           .json({ products: result.docs, pagesCount: result.pages });
//       }
//     }
//   );
// };
exports.allProducts = (req, res) => {
  Product.find()
    .sort({ name: 1 })
    .then((products) => res.json(products));
};

exports.getProducts = async function (req, res, next) {
  // Validate request parameters, queries using express-validator

  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  var companyId = req.user._id ? req.user._id : null;
  try {
    var products = await ProductService.getProducts(
      { company: companyId },
      page,
      limit
    );

    const returnProducts = await Promise.all(
      products.map(async (product) => {
        category = await CategoryService.findCategoryNamebyId(
          product.category,
          companyId
        );

        return {
          name: product.name,
          description: product.description,
          productItems: product.productItems,
          category: category,
          company: product.company,
          imageURL: product.imageURL,
        };
      })
    );

    return res.status(200).json({
      status: 200,
      data: returnProducts,
      message: 'Succesfully All Product Retrieved',
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

// handle GET request at /api/product/my_products to get list of all products
// paginate is a mongoose external plugin to handle pagination
// exports.userProducts = (req, res) => {
//   let page = req.query.page || 1;
//   let perPage = parseInt(req.query.perPage);

//   // if the user us admin, let him fetch all the products
//   if (req.user.isAdmin) {
//     Product.paginate(
//       {},
//       {
//         sort: { creationDate: -1 },
//         populate: "seller",
//         page: page,
//         limit: perPage,
//       },
//       (err, result) => {
//         if (err) {
//           res.status(400).json({ message: "Couldn't find products" });
//         } else {
//           res
//             .status(200)
//             .json({ products: result.docs, pagesCount: result.pages });
//         }
//       }
//     );
//   } else {
//     // if the user isn't admin then he will just be able to edit his products
//     Product.paginate(
//       { seller: req.user.id },
//       {
//         sort: { creationDate: -1 },
//         populate: "seller",
//         page: page,
//         limit: perPage,
//       },
//       (err, result) => {
//         if (err) {
//           res.status(400).json({ message: "Couldn't find products" });
//         } else {
//           res.status(200).json({
//             products: result.docs,
//             current: result.page,
//             pages: result.pages,
//           });
//         }
//       }
//     );
//   }
// };

// handle POST request at /api/product/create to create a new product
// will pass an array of functions as a middleware
exports.createProduct = async function (req, res) {
  // if (!req.files) {
  //   return res.status(400).json({ message: "Please upload an image" });
  // }

  // const images_url = req.files.map((image) => image.path);

  // create new product after being validated and sanitized
  let newProduct = {
    name: req.body.name,
    description: req.body.description,
    productItems: req.body.productItems,
    category: await CategoryService.findCategoryIdByName(
      req.body.category,
      req.user._id
    ),
    company: req.user._id,
  };
  try {
    const createdProduct = await ProductService.create(newProduct);
    return res.status(createdProduct.success ? 200 : 400).send(createdProduct);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }

  // newProduct.save(function (err, product) {
  //   if (err) {
  //     res.status(400).json({
  //       message: "Couldn't create please try again",
  //     });
  //   } else {
  //     //create productItem
  //     // var data = JSON.parse(req.body.body_data);
  //     // var sku_code = "";
  //     // var color = req.body.color ? req.body.color : null;
  //     // var size = req.body.size ? req.body.size : null;
  //     // var material = req.body.material ? req.body.material : null;

  //     res.status(200).json({
  //       message: 'Added Succefulyl',
  //       product,
  //     });
  //   }
  // });
};
//handle PUT request at /api/product/:id/update to update a product with id
exports.updateProduct = async function (req, res) {
  // create clear updatedCategory after sanitization
  let productToUpdate = {
    name: req.body.name,
    description: req.body.description,
    productItems: req.body.productItems,
    category: await CategoryService.findCategoryIdByName(
      req.body.category,
      req.user._id
    ),
    company: req.user._id,
    _id: req.params.id,
  };
  try {
    const updatedProduct = await ProductService.update(productToUpdate);
    return res.status(updatedProduct.success ? 200 : 400).send(updatedProduct);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//handle update sub product
exports.updateProductItem = (req, res) => {
  // companyId = req.user.companyId;
  name = req.body.name;
  sku = req.body.sku;
  price = req.body.price;
  numberInStock = req.body.numberInStock;

  Product.findOneAndUpdate(
    {
      // companyId: companyId,
      name: name,
      'productItems.sku': sku,
    },
    {
      $set: {
        'productItems.$.price': price,
        'productItems.$.numberInStock': numberInStock,
      },
    },
    null,
    (err) => {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Updated', name);
      }
      res.send({ message: 'Update success' });
    }
  );
};

// handle GET request at /api/product/:id to get details for a specific product
// exports.productDetails = (req, res) => {
//   Product.findById(req.params.id)
//     .populate("category")
//     .populate("seller")
//     .exec(function (err, result) {
//       if (err) {
//         res.status(404).json({ message: "Not Found" });
//       } else {
//         res.json(result);
//       }
//     });
// };

// handle DELETE request at /api/product/:id/delete to delete an item by its id
// we will only allow one user who is "admin" to delete products
// cause every product has instances and i didn't handle deleting them
// exports.deleteProduct = (req, res) => {
//   User.findById(req.user.id, (err, user) => {
//     if (user.username != "admin") {
//       res
//         .status(400)
//         .json({ message: "You can't delete, please contact your admin" });
//     } else {
//       Product.findByIdAndDelete(req.params.id, (err) => {
//         if (err) {
//           res.status(400).json({ message: "Couldn't delete, try again" });
//         } else {
//           res.status(200).json({ message: "Deleted Successfully" });
//         }
//       });
//     }
//   });
// };

// handle POST request at /api/product/:id/update to update an item
// exports.updateProduct = (req, res) => {
//   const images_url = req.files.map((image) => image.path);

//   // find one product in the database to get the same images
//   //if the user won't update the images
//   Product.findById(req.params.id, "productImage")
//     .then((product) => {
//       // create updated product with the provided data
//       let updatedProduct = {
//         name: req.body.name,
//         description: req.body.description,
//         category: req.body.category,
//         price: req.body.price,
//         numberInStock: req.body.numberInStock,
//         productImage: req.files[0] ? images_url : product.productImage,
//       };

//       // update with the new data
//       Product.findByIdAndUpdate(req.params.id, updatedProduct, {
//         new: true,
//         useFindAndModify: false,
//       })
//         .then((product) => {
//           res.status(200).json({
//             message: "Successfuly Updated",
//             product,
//           });
//         })
//         .catch(() => res.json(400).json({ message: "Error updating" }));
//     })
//     .catch((err) => res.json(err));
// };
