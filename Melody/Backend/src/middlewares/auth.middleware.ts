import { NextFunction, Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";
import { Payload } from "../dto/user.dto";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({path: "/.env"});

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
  if (!header) {
    return res.status(401).json({ message: "Unauthorized1" });
  }
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
  return res.status(401).json({ message: "Unauthorized" });
  }
  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized2" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server Error" });
    }
  try{
    const decode = jwt.verify(token, process.env.JWT_SECRET) as Payload;
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized3" });
    }
    req.currentUser = decode;
  } catch (err) {
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
  