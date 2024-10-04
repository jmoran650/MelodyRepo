
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
      name: string;
    };
  }


export class PostController {

  static async makePost(req: Request, res: Response) {
    const userId = req.currentUser?.id;
    const { postType, postText } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRepository = MelodyDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postRepository = MelodyDataSource.getRepository(Post);
    const post = new Post();
    post.postType = postType;
    post.postUserId = userId;
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

  static async getPostsByUser(req: Request, res: Response) {
    const { userId } = req.params;
    const postRepository = MelodyDataSource.getRepository(Post);
    try {
      const posts = await postRepository.find({
        where: { postUserId: userId },
      });
      return res.status(200).json({
        data: posts,
      });
    } catch (error) {
      console.error('Error fetching posts by user:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

}