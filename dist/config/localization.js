"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessages = void 0;
exports.responseMessages = {
    response_success_get: 'Data Fetched Successfully',
    response_success_post: 'Data Created Successfully',
    response_success_put: 'Data Updated Successfully',
    response_success_delete: 'Data Deleted Successfully',
    response_error_get: 'Error While Fetching Data',
    response_error_post: 'Error While Creating Data',
    response_error_put: 'Error While Updating Data',
    response_error_delete: 'Error While Deleting Data',
    No_document_found_with_the_provided_Id: (id) => `No_document_found_with_the_id ${id}`,
    unauthorized_access: 'Unauthorized access.',
    invalid_token: 'Invalid token',
    unauthorized_user: 'Unauthorized user',
    jwt_token_required: 'JWT token are required.',
    fields_cannot_modify: 'Fields cannot be modify',
    otp_verify_success: 'OTP verified successfully',
    registration_success: 'Registered user successfully',
    otp_send_success: 'OTP sent successfully',
    unexpected_error: 'An unexpected error occurred',
    login_success: 'You are successfully logged in',
    verify_success: 'verified successfully',
    msg_success: 'Successfully Done',
    logout_success: 'You are successfully logged out',
    subscription_success: 'Subscribed Successfully',
};
