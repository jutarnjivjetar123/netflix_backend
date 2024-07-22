import { Entity, PrimaryGeneratedColumn, Generated, Column } from "typeorm";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn("uuid")
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
