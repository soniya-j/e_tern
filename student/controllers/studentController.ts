import { Request, Response } from 'express';
import {
  getStudentsByUserIdUseCase,
  addStudentUseCase,
  updateStudentUseCase,
  getStudentsUseCase,
  getStudentByIdAdminUseCase,
  getStudentSubscriptionsUseCase,
} from '../useCases/studentUseCase';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { IStudentBody } from '../../types/student/studentType';
import { IUserBody } from '../../types/user/userTypes';
import ExcelJS from 'exceljs';

export const getStudentsByUserId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  try {
    const userId = res.locals.userId as string;
    const result = await getStudentsByUserIdUseCase(userId);
    return res.status(200).json({
      success: true,
      message: responseMessages.response_success_get,
      result: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: responseMessages.unexpected_error,
    });
  }
};

export const addStudent = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IStudentBody;

  const result = await addStudentUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { studentId } = req.params as { studentId: string };
  const data = req.body as IStudentBody;
  const result = await updateStudentUseCase(studentId, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});

export const getStudents = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const filters = {
      fullName: req.query.fullName as string,
      subscribed:
        req.query.subscribed === 'true'
          ? true
          : req.query.subscribed === 'false'
            ? false
            : undefined,
      isActive:
        req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    };
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const result = await getStudentsUseCase(filters, limit, page);
    return res.status(200).json({
      success: true,
      message: 'Fetch users successfully',
      result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};

export const getStudentByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await getStudentByIdAdminUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const exportStudent = async (req: Request, res: Response) => {
  try {
    const filters = {
      fullName: req.query.fullName as string,
      subscribed:
        req.query.subscribed === 'true'
          ? true
          : req.query.subscribed === 'false'
            ? false
            : undefined,
      isActive:
        req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    };

    const usersData = await getStudentsUseCase(filters, 100000, 1);

    if (!usersData || usersData.data.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'No users found for export',
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users List');

    // Define columns
    worksheet.columns = [
      { header: 'Full Name', key: 'fullName', width: 20 },
      { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Date of Birth', key: 'dob', width: 15 },
      { header: 'Parent Name', key: 'parentName', width: 20 },
      { header: 'Subscription', key: 'subscription', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    // Add rows
    usersData.data.forEach((user) => {
      const userDetails =
        typeof user.userId === 'object' ? user.userId : ({} as Partial<IUserBody>);
      worksheet.addRow({
        fullName: user.fullName,
        mobileNumber: userDetails.mobileNumber || 'N/A',
        email: userDetails.email || 'N/A',
        dob: user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A',
        parentName: userDetails.parentName || 'N/A',
        subscription: user.subscribed ? 'Subscribed' : 'Free user',
        status: user.isActive ? 'Active' : 'Inactive',
      });
    });

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Write to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Error exporting users',
    });
  }
};

export const studentSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const result = await getStudentSubscriptionsUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
