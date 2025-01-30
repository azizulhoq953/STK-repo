class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(statusCode: number, message: string, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }

  export default AppError;

  
//   class AppError extends Error {
//   public statusCode: number;
//   public isOperational: boolean;

//   constructor(message: string, statusCode: number = 500, isOperational = true) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;

//     // Ensure the stack trace is captured
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// export default AppError;
