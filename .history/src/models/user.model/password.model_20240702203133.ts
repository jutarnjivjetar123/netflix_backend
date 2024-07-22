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
  @PrimaryGeneratedColumn("uuid")
  passwordID: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
