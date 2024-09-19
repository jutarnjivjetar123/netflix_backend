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
  schema: "Users",
})
export default class UserPublicId {
  @PrimaryGeneratedColumn("uuid")
  publicId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  modifiedAt: Date | null;
}
