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

@Entity("UserSessions", {
  schema: "Users",
})
export default class UserSession {
  @PrimaryGeneratedColumn("uuid")
  sessionID: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  refreshToken: string;

  @Column({
    type: "bigint",
  })
  createdAt: string;

  @Column({
    type: "bigint",
  })
  expiresAt: string;
}
