import { Entity, PrimaryColumn, Column } from "typeorm";

enum statusType {
  ACCEPTED = "Accepted",
  DENIED = "Denied",
  PENDING = "Pending"
}

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

