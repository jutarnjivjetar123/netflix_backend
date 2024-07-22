import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from "typeorm";

import User from "./user.model";

@Entity("UserHash", {
  schema: "Users",
})
export default class UserHash {
  @PrimaryGeneratedColumn("uuid")
  hashID: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date | null;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date | null;

  @OneToOne(() => User)
  @JoinColumn()
  hashOwner: User;
}
