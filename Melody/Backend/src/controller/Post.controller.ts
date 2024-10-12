import { Request, Response } from "express";
import { MelodyDataSource } from "../dataSource";
import { Post } from "../entity/Post";
import { User } from "../entity/User.entity";
import { validate } from "class-validator";
import { CreatePostDTO } from "../dto/post.dto";
import { plainToClass } from "class-transformer";

//import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
    name: string;
  };
}

export class PostController {
  static async makePost(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.currentUser?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Transform and validate request body into DTO
      const createPostDTO = plainToClass(CreatePostDTO, req.body);

      // Validate the DTO
      const errors = await validate(createPostDTO);

      if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const postRepository = MelodyDataSource.getRepository(Post);

      // Create and save the post
      const post = postRepository.create({
        ...createPostDTO,
        postUserId: userId,
      });

      await postRepository.save(post);
      return res.status(201).json({ message: "Post created", post });
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
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
      console.error("Error fetching posts by user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
