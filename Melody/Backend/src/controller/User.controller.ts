import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/helpers";
import * as cache from "memory-cache";

export class UserController {

  static async signup(req: Request, res: Response) {
    const { name, email, password} = req.body;
    const encryptedPassword = await encrypt.encryptpass(password);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = encryptedPassword;
    user.role = "user";

    const userRepository = MelodyDataSource.getRepository(User);

    const userExists = await userRepository.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    await userRepository.save(user);
    
    
    userRepository.create({ name, email, password });
    const token = encrypt.generateToken({ id: user.id, role: user.role });

    return res
      .status(200)
      .json({ message: "User created successfully", token, user });
  }
  static async getUsers(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      return res.status(200).json({
        data,
      });
    } else {
      console.log("serving from db");
      const userRepository = MelodyDataSource.getRepository(User);
      const users = await userRepository.find();

      cache.put("data", users, 6000);
      return res.status(200).json({
        data: users,
      });
    }
  }
  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(200).json({ message: "updated", user });
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    await userRepository.remove(user);
    res.status(200).json({ message: "user deleted" });
  }
}