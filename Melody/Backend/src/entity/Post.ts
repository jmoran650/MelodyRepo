import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "../types/postType";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: PostType,
  })
  postType!: string;

  @Column("uuid")
  postUserId!: string;

  @Column()
  postText!: string;
}
