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
  schema: "User",
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

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string | null;
}
