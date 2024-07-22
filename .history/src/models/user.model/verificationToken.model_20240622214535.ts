import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "./user.model";
import UserPassword from "./password.model";
import Email from "./email.model";
