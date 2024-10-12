// src/dto/postData.dto.ts

import { IsOptional, IsString, IsArray } from "class-validator";
import { PostData } from "../types/postData";

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