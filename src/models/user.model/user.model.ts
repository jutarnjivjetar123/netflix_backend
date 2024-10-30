import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity("User", {
  schema: "User",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column()
  usedEmailToSignUp: boolean;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string | null;
}
