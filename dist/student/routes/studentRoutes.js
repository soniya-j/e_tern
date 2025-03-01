"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const authentication_1 = require("../../middleware/authentication");
const studentRequest_1 = require("../requests/studentRequest");
//import { getStudentById } from '../repos/studentRepo';
const router = (0, express_1.Router)();
router.get('/all', authentication_1.authenticateUser, studentController_1.getStudentsByUserId);
router.post('/addStudent', authentication_1.authenticateUser, studentRequest_1.studentAddValidation, studentController_1.addStudent);
router.put('/updateStudent/:studentId', authentication_1.authenticateUser, studentRequest_1.studentUpdateValidation, studentController_1.updateStudent);
//Admin panel Apis
router.get('/allAdmin', studentController_1.getStudents);
router.get('/export-students', authentication_1.authenticateAdmin, studentController_1.exportStudent);
router.get('/dashboard/subscriptions', authentication_1.authenticateAdmin, studentController_1.studentSubscriptions);
router.get('/:id', authentication_1.authenticateAdmin, studentController_1.getStudentByIdAdmin);
exports.default = router;
