import { Entity, PrimaryColumn, Column } from "typeorm";
import { statusType } from "../types/friendType";

@Entity()
export class Friend {
  @Column("uuid")
  requesterId!: string;

  @Column("uuid")
  receiverId!: string;

  @Column()
  status!: typeof statusType;

  // other columns...
}