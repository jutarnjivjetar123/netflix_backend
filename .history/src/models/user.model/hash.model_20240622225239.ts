import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  PrimaryColumn
} from "typeorm";

import User from "./user.model";

@Entity("UserHash", {
  schema: "Users",
})
export default class UserHash {
  @PrimaryColumn())
  hashID: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  hashOwner: User;
}
