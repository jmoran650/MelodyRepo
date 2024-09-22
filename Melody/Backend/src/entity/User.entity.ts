import { 
  Entity, 
  PrimaryGeneratedColumn, Column, 
  CreateDateColumn, UpdateDateColumn,
  Unique
}
from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "user" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


}
