import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminCredentials, JWTPayload } from "./auth.types";

const adminData: AdminCredentials = {
  username: "admin",
  password: bcrypt.hashSync("admin123", 10),
};

export const AuthService = {
  authenticate: async (username: string, password: string) => {
    if (username === adminData.username && bcrypt.compareSync(password, adminData.password)) {
      const payload: JWTPayload = { username, role: "admin" };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1d" }
      );
      return { token };
    }
    throw new Error("Invalid credentials");
  },
};