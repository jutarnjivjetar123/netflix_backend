import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, DeleteDateColumn } from "typeorm";

import User from "./user.model";

@Entity("UserHash", {
    schema: "Users",
})
export default class UserHash { 
    @PrimaryGeneratedColumn("uuid")
    hashID: string;

    @Column()
    hash: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => User)
    @JoinColumn()
    
}