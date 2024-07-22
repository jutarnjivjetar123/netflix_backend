import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";

import User from "./user.model";

@Entity("UserHash", {
    schema: "Users",
})
export default class UserHash