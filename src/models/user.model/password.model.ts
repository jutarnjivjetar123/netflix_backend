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

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  hash: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date | null;
}
