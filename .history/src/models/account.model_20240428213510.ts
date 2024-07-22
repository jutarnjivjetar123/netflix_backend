import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@EntityRepository({
    name: "Account",
    schema: "public"
})