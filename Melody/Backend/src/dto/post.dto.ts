// dtos/createPost.dto.ts

import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { PostData } from "../types/postData";
import { PostType } from "../types/postType";

export class PostDataDTO implements PostData {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreatePostDTO {
  @IsEnum(PostType)
  postType!: PostType;

  @IsNotEmpty()
  @IsString()
  postText!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostDataDTO)
  data?: PostDataDTO;
}
