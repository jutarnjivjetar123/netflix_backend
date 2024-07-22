import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity({
  name: "Session",
  schema: "public",
})
export default class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  sessionToken: string;
}
