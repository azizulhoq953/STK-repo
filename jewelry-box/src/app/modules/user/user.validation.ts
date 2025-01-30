// src/app/modules/user/user.validation.ts

import { z } from 'zod';

export const passwordValidations = {
  forgotPasswordSchema: z.object({
    body: z.object({
      email: z.string({
        required_error: "Email is required"
      }).email('Invalid email format')
    })
  }),

  resetPasswordSchema: z.object({
    body: z.object({
      token: z.string({
        required_error: "Reset token is required"
      }).min(1, 'Reset token is required'),
      newPassword: z.string({
        required_error: "New password is required"
      }).min(6, 'Password must be at least 6 characters')
        .max(32, 'Password cannot exceed 32 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: z.string({
        required_error: "Password confirmation is required"
      })
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"]
    })
  }),

  verifyTokenSchema: z.object({
    params: z.object({
      token: z.string({
        required_error: "Token is required"
      }).min(1, 'Token is required')
    })
  })
};

export type ForgotPasswordRequest = z.infer<typeof passwordValidations.forgotPasswordSchema>['body'];
export type ResetPasswordRequest = z.infer<typeof passwordValidations.resetPasswordSchema>['body'];
export type VerifyTokenRequest = z.infer<typeof passwordValidations.verifyTokenSchema>['params'];

export default passwordValidations;