"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authentication_1 = require("../../middleware/authentication");
const categoryRequest_1 = require("../requests/categoryRequest");
const multer_1 = __importDefault(require("../../middleware/multer"));
const router = (0, express_1.Router)();
router.get('/all', authentication_1.authenticateAdmin, categoryController_1.getCategories);
router.get('/by-package/:studentId/:type', authentication_1.authenticateUser, categoryRequest_1.getCategoryByPackageIdValidation, categoryController_1.getCategoriesByPackageId);
router.post('/', authentication_1.authenticateAdmin, multer_1.default, categoryRequest_1.categoryCreateValidation, categoryController_1.createCategory);
router.put('/:id', authentication_1.authenticateAdmin, multer_1.default, categoryRequest_1.categoryUpdateValidation, categoryRequest_1.categoryCreateValidation, categoryController_1.updateCategory);
router.delete('/:id', authentication_1.authenticateAdmin, categoryRequest_1.categoryUpdateValidation, categoryController_1.deleteCategory);
router.get('/:id', authentication_1.authenticateAdmin, categoryRequest_1.categoryUpdateValidation, categoryController_1.getCategoriesById);
exports.default = router;
