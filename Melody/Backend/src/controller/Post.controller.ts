
import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { Post } from "../entity/Post";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/helpers";
//import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    currentUser?: {
      id: string;
      role: string;
    };
  }


export class PostController {

  static async makePost(req: Request, res: Response) {
    const { id } = req.params; // userId in the URL
    const { postType, postText } = req.body; // postType and postText in the body

    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const postRepository = MelodyDataSource.getRepository(Post);
    const post = new Post();
    post.postType = postType;
    post.postUserId = id;
    post.postText = postText;

    await postRepository.save(post);
    res.status(200).json({ message: "Post created", post });
  }

  static async getPosts(req: Request, res: Response) {
    const postRepository = MelodyDataSource.getRepository(Post);
    const posts = await postRepository.find();
    return res.status(200).json({
      data: posts,
    });
  }

}