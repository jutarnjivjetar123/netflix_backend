import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "VerificationToken",
    schema: "public",
})
export default class VerificationToken {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  identifier: string;

  @Column()
  token: string;

  @Column()
  expires: Date;

}