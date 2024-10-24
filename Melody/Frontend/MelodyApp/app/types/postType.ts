// types/postType.ts

export enum PostType {
    SCENT = "scent",
    FACE = "face",
    BODY = "body",
    SUPPLEMENTS = "supplements",
  }

export interface Post {
    id: string;
    postType: string;
    postText: string;
    postUserId: string;
    data?: {
      productName?: string;
      companyName?: string;
      imageUrl?: string;
      tags?: string[];
    };
  }