import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";

import User from "./user.model";
@Entity("UserPassword", {
  schema: "Users",
})
export default class UserPassword {
  @PrimaryColumn("uuid")
  passwordID: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  userID: User;
}
