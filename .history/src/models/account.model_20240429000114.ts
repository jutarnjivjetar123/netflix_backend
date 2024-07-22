import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./user.model";

@Entity({
  name: "Account",
  schema: "public",
})
export default class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (userId) => user.id)
  userId: string;

  @Column()
  type: string;

  @Column({ unique: true })
  provider: string;

  @Column({ unique: true })
  providerAccountId: string;

  @Column()
  refresh_token: string;

  @Column()
  access_token: string;

  @Column()
  expires_at: number;

  @Column()
  token_type: string;

  @Column()
  scope: string;

  @Column()
  id_token: string;

  @Column()
  session_state: string;
}


