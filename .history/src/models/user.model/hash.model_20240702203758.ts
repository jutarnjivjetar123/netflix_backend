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

@Entity("UserSalt", {
  schema: "Users",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  saltID: string;

  @Column()
  salt: string;

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
  saltOwner: User;
}
