import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "../user.model/user.model";

@Entity("UserPhoneNumber", {
  schema: "Users",
})
export class UserPhoneNumber {
  @PrimaryGeneratedColumn("uuid")
  phoneNumberID: string;

  @Column()
  phoneNumber: string;
    
  @JoinColumn()
  @OneToOne(() => User)
  phoneNumberOwner: User;
}
