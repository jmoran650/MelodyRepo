import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/helpers";
import jwt from 'jsonwebtoken';


interface AuthenticatedRequest extends Request {
    currentUser?: {
      id: string;
      role: string;
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
      const user: User | null = await userRepository.findOne({ where: { email } });
      console.log("password", password);
      console.log("hashed password", user!.password);
      const isPasswordValid = encrypt.comparepassword(user!.password, password);

      console.log("isPasswordValid", isPasswordValid);
      if (!user) {
        console.log("User not found with that email");
      }
      if (!user || !isPasswordValid) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = encrypt.generateToken({ id: user.id, role: user.role });
      console.log("token", token);
      return res.status(201).json({ message: "Login successful", user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the 'Bearer <token>' format

      if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
      }

      const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Use your JWT secret key

      jwt.verify(token, secretKey, async (err, decoded: any) => {
        if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ message: 'Invalid token' });
        }

        // Optionally, fetch the user from the database to get updated information
        const userRepository = MelodyDataSource.getRepository(User);

        const user = await userRepository.findOne({
          where: { id: decoded.id },
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data (exclude sensitive fields)
        return res.json({
          id: user.id,
          //name: user.name,
          //email: user.email,
          role: user.role,
          // ...include other fields as needed
        });
      });
    } catch (error) {
      console.error('Error validating token:', error);
      return res.status(500).json({ message: 'Internal server error' });
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
}