import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import User from "../user.model/user.model";
import Offer from "../subscription.model/offer.model";
@Entity({
  name: "Subscription",
  schema: "Subscription",
})
export default class Subscription {
  @PrimaryGeneratedColumn("uuid")
  subscriptionId: string;

  @OneToOne((type) => User, {})
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToOne((type) => Offer, {})
  @JoinColumn({ name: "offerId" })
  offer: Offer;

  @Column({ type: "bigint" })
  expiresAt: string;

  @Column({ type: "money" })
  monthlyCost: number;

  @Column()
  isActive: boolean;

  @Column({
    nullable: true,
  })
  timezone: string;

  @Column({
    nullable: true,
  })
  timezoneOffset: number;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({ nullable: true, type: "bigint" })
  modifiedAt: string | null;
}
