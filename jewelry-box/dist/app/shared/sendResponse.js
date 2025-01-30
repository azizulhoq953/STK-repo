"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, responseData) => {
    const { success, statusCode, message, pagination, data } = responseData;
    res.status(statusCode).json({
        success,
        message,
        pagination,
        data,
    });
};
exports.default = sendResponse;
