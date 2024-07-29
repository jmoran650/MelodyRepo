import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {PostType} from "../types/postType";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: PostType
  })
  type!: string;

  @Column()
  userId!: number;

  // other columns...
}