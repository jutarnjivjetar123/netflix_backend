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
  schema: "User",
})
export default class UserEmail {
  @PrimaryGeneratedColumn("uuid")
  userEmailId: number;

  @OneToOne((type) => User, {})
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  email: string;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string;
}
