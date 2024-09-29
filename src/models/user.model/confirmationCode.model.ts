import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "../user.model/user.model";

@Entity({
  schema: "Users",
  name: "ConfirmationCode",
})
export default class ConfirmationCode {
  @PrimaryGeneratedColumn("uuid", { name: "confirmationCodeId" })
  confirmationCodeId: string;

  @Column()
  confirmationCode: string;

  @OneToOne((type) => User, {})
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  isConfirmed: boolean;

  @Column()
  isSent: boolean;
  @Column("bigint")
  createdAt: string;

  @Column("bigint", { nullable: true })
  modifiedAt: string | null;
}
