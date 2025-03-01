import { Request, Response } from 'express';
import {
  registerUserUseCase,
  uploadAvatarUseCase,
  verifyOtpUseCase,
  sendOtpUseCase,
  getProfileUseCase,
  getCourseMaterialTrackUseCase,
  updateUserUseCase,
  getUsersUseCase,
  loginUseCase,
  registerAdminUseCase,
  updateParentDobUseCase,
  verifyParentDobUseCase,
  switchStudentUseCase,
  logoutUseCase,
  getUserCountUseCase,
} from '../useCases/userUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import {
  IOtpBody,
  IUserBody,
  ILoginBody,
  IUserDobBody,
  IDobBody,
} from '../../types/user/userTypes';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import AppError from '../../common/appError';
import ExcelJS from 'exceljs';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IUserBody;
  const result = await registerUserUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.registration_success,
    result: result,
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  const data = req.body as IOtpBody;
  const result = await verifyOtpUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.otp_verify_success,
    result,
  });
});

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
  }
  if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
    return res.status(400).json({ status: 'fail', error: 'Unsupported file type' });
  }
  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ status: 'fail', error: 'file size exceeded' });
  }
  const userId = res.locals.userId as string; // get userId from locals ( using JWT middleware )
  if (!userId || userId === '') {
    return res.status(401).send('Unauthorized');
  }
  const imageUrl = await uploadAvatarUseCase(req.file, userId);
  res.status(200).json({
    status: 'success',
    message: 'image uploaded successfully',
    result: imageUrl,
  });
};

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  const data = req.body as IOtpBody;
  const result = await sendOtpUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.otp_send_success,
    result,
  });
});

export const getProfile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  try {
    const { userId } = req.params;
    const result = await getProfileUseCase(userId);
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

export const courseMaterialTrack = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  try {
    const { userId } = req.params;
    const result = await getCourseMaterialTrackUseCase(userId);
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

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { userId } = req.params as { userId: string };
  const data = req.body as IUserBody;
  const result = await updateUserUseCase(userId, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});

export const getUsers = async (req: Request, res: Response) => {
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
      mobileNumber: req.query.mobileNumber
        ? parseInt(req.query.mobileNumber as string, 10)
        : undefined,
      status: req.query.status ? parseInt(req.query.status as string) : undefined,
    };
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const result = await getUsersUseCase(filters, limit, page);
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

export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ILoginBody;
  const result = await loginUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.login_success,
    result,
  });
});

export const registerAdmin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IUserBody;
  const result = await registerAdminUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.registration_success,
    result: result,
  });
});

export const updateParentDob = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { userId } = req.params as { userId: string };
  const { parentDob, parentName } = req.body as IDobBody;
  const result = await updateParentDobUseCase(userId, parentDob, parentName);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});

export const verifyParentDob = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { userId, parentDobYear } = req.body as IUserDobBody;
  const result = await verifyParentDobUseCase(userId, parentDobYear);
  res.status(200).json({
    success: true,
    message: responseMessages.verify_success,
    result,
  });
});

export const switchStudent = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const userId = res.locals.userId as string;
  const { studentId } = req.params;
  const result = await switchStudentUseCase(userId, studentId);
  res.status(200).json({
    success: true,
    message: responseMessages.msg_success,
    result,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { deviceType } = req.body;
  const userId = res.locals.userId as string;
  const result = await logoutUseCase(userId, deviceType);
  res.clearCookie('token');
  res.setHeader('Clear-Site-Data', '"cookies"');
  res.status(200).json({
    success: true,
    message: responseMessages.logout_success,
    result,
  });
});

export const getUserCount = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  try {
    const result = await getUserCountUseCase();
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

export const exportUsers = async (req: Request, res: Response) => {
  try {
    const filters = {
      fullName: req.query.fullName as string,
      mobileNumber: req.query.mobileNumber
        ? parseInt(req.query.mobileNumber as string, 10)
        : undefined,
      status: req.query.status ? parseInt(req.query.status as string) : undefined,
    };

    const usersData = await getUsersUseCase(filters, 10000, 1); // Get all users (adjust limit as needed)

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
      { header: 'Status', key: 'status', width: 10 },
    ];

    // Add rows
    usersData.data.forEach((user: IUserBody) => {
      worksheet.addRow({
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        status: user.status,
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
