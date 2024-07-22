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
  @PrimaryColumn()
  userID: string;

  @Column()
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
