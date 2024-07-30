import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column()
  userName!: string;

  @Column()
  userEmail!: string;
}
