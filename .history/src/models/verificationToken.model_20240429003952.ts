import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "VerificationToken",
  schema: "dev",
})
export default class VerificationToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  identifier: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expires: Date;
}
