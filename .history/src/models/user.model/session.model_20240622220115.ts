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
  @PrimaryGeneratedColumn("uuid")
  sessionID: string;

  @OneToOne(() => User)
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
  userAgent: string;

  @OneToOne(() => UserVerificationToken)
  authToken: string;

  @Column()
  crsfToken: string;
    
    
}