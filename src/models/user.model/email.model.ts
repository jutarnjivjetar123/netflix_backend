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

@Entity("UserEmail", {
  schema: "Users",
})
export default class UserEmail {
  @PrimaryGeneratedColumn("uuid")
  emailID: number;

  @OneToOne((type) => User, {})
  @JoinColumn({ name: "userUserID" })
  user: User;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  modifiedAt: Date;
}
