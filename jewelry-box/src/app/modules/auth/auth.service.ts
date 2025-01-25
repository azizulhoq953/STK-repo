import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminCredentials } from "./auth.types";

const adminData: AdminCredentials = {
  username: "admin",
  password: bcrypt.hashSync("admin123", 10), // Predefined hashed password
};

export const AuthService = {
  authenticate: async (username: string, password: string) => {
    if (username === adminData.username && bcrypt.compareSync(password, adminData.password)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || "secret", {
        expiresIn: "1d",
      });
      return { token };
    }
    throw new Error("Invalid credentials");
  },
};
