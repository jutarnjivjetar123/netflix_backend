import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import UserEmail from "../user.model/email.model";
@Entity("Users", {
  schema: "Users",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  userID: string;

  @Column({
    nullable: true,
  })
  firstName: string | null;

  @Column({
    nullable: true,
  })
  lastName: string | null;

  @Column({
    nullable: true,
  })
  username: string | null;

  @Column()
  usedEmailToSignUp: boolean;

  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  modifiedAt: Date | null;
}
