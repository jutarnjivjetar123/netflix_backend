import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

@Entity("Users", {
  schema: "Users",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column()
  usedEmailToSignUp: boolean;
  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  modifiedAt: Date | null;
}
