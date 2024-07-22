import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({
    name: "Movie",
    schema: "public"
})
export default class Movie