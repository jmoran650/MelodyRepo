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
      console.log("[AuthController] login called with:", email, password);

      if (!email || !password) {
        return res.status(500).json({ message: "email and password required" });
      }

      const userRepository = MelodyDataSource.getRepository(User);
      const user: User | null = await userRepository.findOne({ where: { email } });
      console.log("[AuthController] Found user:", user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await encrypt.comparepassword(password, user.password);
      console.log("[AuthController] isPasswordValid:", isPasswordValid);
      if (!isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }
      await console.log("jwt secret", process.env.JWT_SECRET);
      await console.log("jwt refresh secret", process.env.JWT_REFRESH_SECRET);

      const accessToken = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: "45m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id, role: user.role, name: user.name },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );

      return res.status(201).json({ message: "Login successful", user, token: accessToken, refreshToken });
    } catch (error) {
      console.error("[AuthController] Error in login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async validateToken(req: Request, res: Response) {
    if (req.currentUser) {
      return res.status(200).json(req.currentUser);
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string; name: string; };

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: payload.id, role: payload.role, name: payload.name },
        process.env.JWT_SECRET!,
        { expiresIn: "45m" }
      );

      return res.status(200).json({ token: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
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