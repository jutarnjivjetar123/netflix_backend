import { Entity, PrimaryGeneratedColumn, Generated, Column } from "typeorm";

@Entity("UserEmail")
export class Email {
  @PrimaryGeneratedColumn("increment")
  emailID: number;
  @Column()
  userID: string;
  @Column()
  email: string;
  @Crea()
  createdAt: Date;
  @Column()
  modifiedAt: Date;
}