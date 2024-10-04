import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/helpers";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
    name: string;
  };
}

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: " email and password required" });
      }

      const userRepository = MelodyDataSource.getRepository(User);

      const user: User | null = await userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("user password from db", user!.password);
      console.log("password from user", password);

      const isPasswordValid = await encrypt.comparepassword(
        password,
        user.password
      );
      console.log("isPasswordValid", isPasswordValid);
      if (!isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const token = encrypt.generateToken({
        id: user.id,
        role: user.role,
        name: user.name,
      });

      return res.status(201).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async validateToken(req: Request, res: Response) {
    if (req.currentUser) {
      return res.status(200).json(req.currentUser);
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  static async getOwnProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.currentUser) {
      return res.status(401).json({ message: "Server Error" });
    }
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.currentUser.id },
    });
    return res.status(200).json({ ...user, password: undefined });
  }

  static async getOtherProfile(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    return res.status(200).json({ ...user, password: undefined });
  }
}
