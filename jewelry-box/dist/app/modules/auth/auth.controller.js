"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
exports.AuthController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const result = yield auth_service_1.AuthService.authenticate(username, password);
            res.status(200).json(result);
        }
        catch (error) {
            // Safely handle the `error` type
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(401).json({ error: errorMessage });
        }
    }),
};
// exports.forgotPassword = async (req: { body: { email: any; }; }, res: any, next: (arg0: Error) => void) => {
//   //get user based on posted email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     const error = new Error('There is no user with email address');
//     return next(error);
//   }
//   //generate random reset token
//   const resetToken = user.passwordResetToken;
//   await user.save();
// }
// export const resetPassword = (req: Request, res: Response, next: NextFunction) => {
// }
