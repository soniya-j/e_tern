"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subCategoryController_1 = require("../controllers/subCategoryController");
const authentication_1 = require("../../middleware/authentication");
const subCategoryRequest_1 = require("../requests/subCategoryRequest");
const multer_1 = __importDefault(require("../../middleware/multer"));
const router = (0, express_1.Router)();
router.get('/all', authentication_1.authenticateAdmin, subCategoryController_1.getSubCategories);
router.get('/by-category/:categoryId/:type', authentication_1.authenticateUser, subCategoryRequest_1.getSubCategoryByCategoryIdValidation, subCategoryController_1.getSubCategoriesByCategoryId);
router.post('/', authentication_1.authenticateAdmin, multer_1.default, subCategoryRequest_1.subCategoryCreateValidation, subCategoryController_1.createSubCategory);
router.put('/:id', authentication_1.authenticateAdmin, multer_1.default, subCategoryRequest_1.subCategoryUpdateValidation, subCategoryRequest_1.subCategoryCreateValidation, subCategoryController_1.updateSubCategory);
router.delete('/:id', authentication_1.authenticateAdmin, multer_1.default, subCategoryRequest_1.subCategoryUpdateValidation, subCategoryController_1.deleteSubCategory);
router.get('/by-categoryAdmin/:categoryId/:type', authentication_1.authenticateAdmin, subCategoryRequest_1.getSubCategoryByCategoryIdValidation, subCategoryController_1.getSubCategoriesByCategoryIdAdmin);
router.get('/:id', authentication_1.authenticateAdmin, subCategoryRequest_1.subCategoryUpdateValidation, subCategoryController_1.getSubCategoriesById);
exports.default = router;
