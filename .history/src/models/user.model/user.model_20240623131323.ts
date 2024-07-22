import {
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  Column,
  PrimaryColumn,
} from "typeorm";

@Entity("Users", {
  schema: "Users",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  userID: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  createdAt: Date;

  @Column()
  modifiedAt: Date;
}
