import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  name: "Movie",
  schema: "public",
})
export default class Movie {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  videoUrl: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  genre: string;

  @Column()
  duration: string;
}
