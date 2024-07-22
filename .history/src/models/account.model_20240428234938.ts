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
}
