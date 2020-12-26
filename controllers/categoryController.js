let async = require('async');

var CategoryService = require('../services/categoryService');
// const Category = require("../models/CategoryModel");
// const Product = require("../models/ProductModel");

// hanle GET request at /api/category to get all the categories
//**********OLD************/
exports.categoryIndex = (req, res) => {
  Category.find()
    .sort({ name: 1 })
    .then((category) => res.json(category));
};

// hanle GET request at /api/category/:id/company and /api/category to get all the categories
exports.getCatagories = async function (req, res, next) {
  // Validate request parameters, queries using express-validator
  console.log('user: ', req.user);
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  var companyId = req.user._id ? req.user._id : null;
  try {
    var categories = await CategoryService.getCategories(
      { company: companyId },
      page,
      limit
    );
    return res.status(200).json({
      status: 200,
      data: categories,
      message: 'Succesfully All Categories Retrieved',
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//handle POST reqest at /api/category/create to create a new category
exports.createCategory = async function (req, res, next) {
  // Create a newCategory object with escaped and trimmed data if it's valid
  let newCategory = {
    name: req.body.name,
    description: req.body.description,
    imageURL: req.body.imageURL,
    company: req.user._id,
  };

  try {
    const createdCategory = await CategoryService.create(newCategory);
    return res
      .status(createdCategory.success ? 200 : 400)
      .send(createdCategory);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

// handle DELETE request at /api/category/:id/delete
exports.deleteCategory = async function (req, res) {
  let categoryIdTodelete = req.params.id;
  try {
    const deletedCategory = await CategoryService.delete(categoryIdTodelete);
    return res
      .status(deletedCategory.success ? 200 : 400)
      .send(deletedCategory);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

//handle PUT request at /api/category/:id/update to update a category with id
exports.updateCategory = async function (req, res) {
  // create clear updatedCategory after sanitization
  let categoryToUpdate = {
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id,
  };
  try {
    const updatedCategory = await CategoryService.update(categoryToUpdate);
    return res
      .status(updatedCategory.success ? 200 : 400)
      .send(updatedCategory);
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
