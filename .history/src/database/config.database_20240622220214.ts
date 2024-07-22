import { DataSource } from "typeorm";

import User from "../models/user.model/user.model";
import UserPassword from "../models/user.model/password.model";
import UserEmail } from "../models/user.model/email.model";
import UserHash from "models/user.model/hash.model";
import UserVerificationToken from "models/user.model/verificationToken.model";
import UserSession from "models/user.model/session.model";

export const DatabaseConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "SuperAdmin",
  password: "1234",
  database: "netflix_clone",
  entities: [User, UserPassword, UserEmail, UserHash, UserVerificationToken, UserSession],
  logging: true,
  synchronize: true,
  subscribers: [],
  migrations: [],
  uuidExtension: "uuid-ossp",
});
