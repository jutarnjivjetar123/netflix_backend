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

    @Column()
    authToken: string;

    @Column()
    
}
