import { Entity, PrimaryGeneratedColumn, Generated, Column, CreateDateColumn } from "typeorm";

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
  @Column()
  modifiedAt: Date;
}
