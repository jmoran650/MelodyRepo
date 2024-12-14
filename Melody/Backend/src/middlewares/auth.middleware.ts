//auth.middleware.ts
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { MelodyDataSource } from "../dataSource";
import { Payload } from "../dto/user.dto";
import { User } from "../entity/User.entity";
dotenv.config({ path: "/.env" });

declare global {
  namespace Express {
    interface Request {
      currentUser?: Payload; // Replace 'any' with the appropriate type
    }
  }
}
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  console.log("[authMiddleware] Authorization header:", header); // Check what header is received

  if (!header) {
    console.log("[authMiddleware] No authorization header, returning 401");
    return res.status(401).json({ message: "Unauthorized1" });
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("[authMiddleware] Header format invalid:", parts);
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = parts[1];
  if (!token) {
    console.log("[authMiddleware] No token after Bearer keyword");
    return res.status(401).json({ message: "Unauthorized2" });
  }
  if (!process.env.JWT_SECRET) {
    console.log("[authMiddleware] No JWT_SECRET set");
    return res.status(500).json({ message: "Server Error" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET) as Payload;
    console.log("[authMiddleware] Decoded token:", decode); // Check decoded payload
    if (!decode) {
      console.log("[authMiddleware] Decoding failed");
      return res.status(401).json({ message: "Unauthorized3" });
    }
    req.currentUser = decode;
    console.log("[authMiddleware] req.currentUser set:", req.currentUser);
  } catch (err) {
    console.log("[authMiddleware] Token verification error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRepo = MelodyDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: req.currentUser!.id },
    });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
