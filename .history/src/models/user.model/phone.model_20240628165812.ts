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

  @Column()
  internationalCallingCode: string;

  @JoinColumn()
  @OneToOne(() => User)
  phoneNumberOwner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifi
}
