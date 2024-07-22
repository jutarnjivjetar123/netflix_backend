import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import User from "./user.model";
import UserVerificationToken from "./verificationToken.model";

@Entity("UserSessions", {
  schema: "Users",
})
export default class UserSession {
  @PrimaryColumn(
  sessionID: string;

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

  @Column()
  crsfToken: string;

  @Column()
  additionalData: string;

  @OneToOne(() => User)
  @JoinColumn()
  sessionOwner: User;

  @OneToOne(() => UserVerificationToken)
  authToken: string;
}