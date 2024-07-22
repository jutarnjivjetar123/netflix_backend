import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
    
    
    
}
