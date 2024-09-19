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
export default class UserPhoneNumber {
  @PrimaryGeneratedColumn("uuid")
  userPhoneNumberID: string;

  @OneToOne((type) => User, {})
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  countryCode: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  modifiedAt: Date | null;
}
