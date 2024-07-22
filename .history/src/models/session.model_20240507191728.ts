import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm";
import User from "./user.model";

@Entity({
  name: "Session",
  schema: "dev",
})
export default class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  token: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: ["insert", "update", "remove", "soft-remove"],
  })
  createdBy: User;

  @Column()
  expires: Date;
}
