import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@Entity({
    name: "Account",
    schema: "public"
})
export default class Account { 

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: string;

    @Column()
    type: string;

    @Column()
    provider: string;

    @Column()
    providerAccountId: string;

    @Column()
    refresh_token: string;
    
    @Column()
    access_token: string;

    @Column()
    expires_at: int;

    
}
