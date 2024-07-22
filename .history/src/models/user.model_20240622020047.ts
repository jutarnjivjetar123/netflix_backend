import { Entity, PrimaryGeneratedColumn, Generated, Column } from 'typeorm';

@Entity("Users")
export class User { 
    @PrimaryGeneratedColumn("uuid")
    

}