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
  firstName: string | null;

  @Column({
    nullable: true,
  })
  lastName: string | null;

  @Column({
    nullable: true,
  })
  username: string | null;

  @Column()
  
  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  modifiedAt: Date | null;
}
