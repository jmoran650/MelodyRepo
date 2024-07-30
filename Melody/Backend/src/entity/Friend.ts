import { Entity, PrimaryColumn, Column } from "typeorm";
import { statusType } from "../types/friendType";

@Entity()
export class Friend {
  @PrimaryColumn("uuid")
  requesterId!: string;

  @PrimaryColumn("uuid")
  receiverId!: string;

  @Column({
    type: "enum",
    enum: statusType,
    default: statusType.PENDING,
  })
  status!: statusType;

}
