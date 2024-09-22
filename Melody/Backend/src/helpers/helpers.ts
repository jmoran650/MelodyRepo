import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Payload } from "../dto/user.dto";

dotenv.config();

const { JWT_SECRET = "" } = process.env;

export class encrypt {

  // Encrypt the password asynchronously
  static async encryptpass(password: string) {
    if (!password) {
      throw new Error("Password is required");
    }
    const saltRounds = 12; // You can adjust the salt rounds if needed
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password with hash
  static async comparepassword(password: string, hashPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashPassword);
    return isPasswordValid;
  }

  // Generate JWT token
  static generateToken(payload: Payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  }
}