import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";

interface AuthenticatedRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
    name: string;
  };
}

export class ProfileController {
  static async getOwnProfile(req: AuthenticatedRequest, res: Response) {
    if (!req.currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.currentUser.id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ ...user, password: undefined });
  }

  static async getOtherProfile(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ ...user, password: undefined });
  }
}