import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "./user.model";

@Entity("UserEmail")
export class Email {
  @PrimaryGeneratedColumn("increment")
  emailID: number;
  @Column()
  userID: string;
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
