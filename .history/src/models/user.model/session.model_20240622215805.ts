import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";

@Entity("UserSessions",
    {
        schema: "Users"
    }
)
export default class UserSession { 
    @PrimaryGeneratedColumn("uuid")
    sessionID: string;

    @OneToOne(() => User)
}
