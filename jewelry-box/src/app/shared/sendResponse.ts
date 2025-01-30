import { Response } from "express";

type ResponseData<T> = {
  success: boolean;
  statusCode: number;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };
  data?: T;
};

const sendResponse = <T>(res: Response, responseData: ResponseData<T>) => {
  const { success, statusCode, message, pagination, data } = responseData;

  res.status(statusCode).json({
    success,
    message,
    pagination,
    data,
  });
};

export default sendResponse;
