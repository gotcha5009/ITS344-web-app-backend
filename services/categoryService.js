const Category = require('../models/CategoryModel');

exports.getCategories = async function (query, page, limit) {
  try {
    var categories = await Category.find(query).sort({ name: 1 });
    return categories;
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Category');
  }
};

exports.create = async function (newCategory) {
  try {
    if (
      await Category.findOne({
        name: newCategory.name,
        company: newCategory.company,
      })
    ) {
      return {
        success: false,
        message: 'Category already exists',
      };
    }

    createdCategory = await Category.create({
      name: newCategory.name,
      description: newCategory.description,
      imageURL: newCategory.imageURL,
      company: newCategory.company,
    })
      .then((createdCategory) => {
        return {
          success: true,
          message: 'Create new category success',
          data: createdCategory,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: err,
        };
      });

    return createdCategory;
  } catch (e) {
    throw Error('Error while Creating Category');
  }
};

exports.findCategoryIdByName = async function (categoryName, companyId) {
  try {
    var category = await Category.findOne({
      name: categoryName,
      company: companyId,
    });
    console.log(category._id);
    return category._id;
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Category');
  }
};

exports.findCategoryNamebyId = async function (categoryId, companyId) {
  try {
    var category = await Category.findOne({
      _id: categoryId,
      company: companyId,
    });
    return category.name;
  } catch (e) {
    // Log Errors
    throw Error('Error while Paginating Category');
  }
};

exports.delete = async function (categoryIdTodelete) {
  try {
    deletedCategory = await Category.findByIdAndDelete(categoryIdTodelete)
      .then((deletedCategory) => {
        return {
          success: true,
          message: 'Delete category successful',
          data: deletedCategory,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: err,
        };
      });
    return deletedCategory;
  } catch (e) {
    throw Error('Error while Deleting Category');
  }
};

exports.update = async function (categoryToUpdate) {
  try {
    updatedCategory = await Category.findByIdAndUpdate(
      categoryToUpdate._id,
      categoryToUpdate,
      {
        new: true,
        useFindAndModify: false,
      }
    )
      .then((category) => {
        return {
          success: true,
          message: 'Update category successful',
          data: category,
        };
      })
      .catch((err) => {
        return {
          success: false,
          message: 'No category founded',
        };
      });
    return updatedCategory;
  } catch (e) {
    throw Error('Error while Updating Category');
  }
};
