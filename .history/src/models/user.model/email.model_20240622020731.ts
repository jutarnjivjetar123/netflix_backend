import { Entity, PrimaryGeneratedColumn, Generated, Column } from "typeorm";

@Entity("UserEmail")
export class Email { 
    @PrimaryGeneratedColumn("increment")
    emailID: number;
    

}