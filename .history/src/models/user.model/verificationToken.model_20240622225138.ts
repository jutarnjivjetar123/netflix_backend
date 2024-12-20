import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "./user.model";

@Entity("UserVerificationToken", {
  schema: "Users",
})
export default class UserVerificationToken {
  
  verificationTokenID: number;

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
