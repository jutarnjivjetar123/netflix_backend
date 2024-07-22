import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";

import User from "./user.model";

@Entity("UserVerificationToken", {
  schema: "Users",
})
export default class UserVerificationToken {
  @PrimaryGeneratedColumn("uuid")
  verificationTokenID: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  tokenOwner: User;

  @Column()
  tokenType: string;
}
