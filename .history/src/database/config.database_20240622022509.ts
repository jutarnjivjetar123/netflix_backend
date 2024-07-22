import { DataSource } from "typeorm";

import User from "../models/user.model/user.model";
import UserPassword from "models/user.model/password.model";
import { Email } from "models/user.model/email.model";
export const DatabaseConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "SuperAdmin",
  password: "1234",
  database: "netflix_clone",
  entities: [User, UserPassword, Email],
  logging: true,
  synchronize: true,
  subscribers: [],
  migrations: [],
  uuidExtension: "uuid-ossp",
});
