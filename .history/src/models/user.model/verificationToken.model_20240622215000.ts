import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";


import User from "./user.model";
import UserPassword from "./password.model";
import UserEmail from "./email.model";

@Entity("UserVerificationToken", {
    schema: "Users",
})
export default class UserVerificationToken { 
    @PrimaryGeneratedColumn("uuid")
    verificationTokenID: 
}


