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
  @Column({
    nullable: true,
  })
  firstName: string | null;

  @Column({
    nullable: true,
  })
  lastName: string | null;

  @Column()
  username: string;

  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  modifiedAt: Date | null;
}
