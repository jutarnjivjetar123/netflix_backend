import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import User from "./user.model";

@Entity({
  name: "Session",
  schema: "public",
})
export default class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  sessionToken: string;

  @ManyToOne(() => User, (userId) => user.id)
  userId: string;
}
