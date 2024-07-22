import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

import User from "./user.model";
import UserVerificationToken from "./verificationToken.model";

@Entity("UserSessions", {
  schema: "Users",
})
export default class UserSession {
  @PrimaryGeneratedColumn()
  sessionID: string;

  @OneToOne(() => User)
  @JoinColumn()
  sessionOwner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastActivityAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  ipAddressOfSessionInitialization: string;

  @Column()
  lastIpAddressOfActivity: string;

  @Column()
  userAgent: string;

  @OneToOne(() => UserVerificationToken)
  authToken: string;

  @Column()
  crsfToken: string;

  @Column()
  additionalData: string;
}