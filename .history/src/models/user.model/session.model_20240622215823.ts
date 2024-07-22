import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
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
}
