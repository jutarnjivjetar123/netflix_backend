import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "../user.model/user.model";
@Entity("UserPublicId", {
  schema: "User",
})
export default class UserPublicId {
  @PrimaryGeneratedColumn("uuid")
  publicId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string | null;
}
