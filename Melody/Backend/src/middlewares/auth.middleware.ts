import { NextFunction, Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";

import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({path: "/.env"});

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Secret Not Configured" });
    }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req[" currentUser"] = decode;
  next();
};


export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userRepo = MelodyDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: { id: req[" currentUser"].id },
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
  