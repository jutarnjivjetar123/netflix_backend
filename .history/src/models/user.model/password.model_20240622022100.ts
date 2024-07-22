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
@Entity("UserPassword")
export default class UserPassword {
  @PrimaryGeneratedColumn("uuid")
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
    
}
