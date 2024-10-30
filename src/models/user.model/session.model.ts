import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

import User from "./user.model";

//TODO: Set UNIQUE restriction back again for ONEToONE relation with User table, currently the relation is ManyToOne
@Entity("UserSessions", {
  schema: "User",
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
