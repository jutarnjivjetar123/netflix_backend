import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn
} from "typeorm";

import User from "./user.model";

@Entity("UserEmail", {
  schema: "Users",
})
export default class UserEmail {
  @PrimaryColumn()
  emailID: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  userID: User;
}
