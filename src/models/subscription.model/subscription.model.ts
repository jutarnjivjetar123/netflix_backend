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
import PaymentDevice from "../subscription.model/paymentDevice.model";
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

  @OneToOne((type) => PaymentDevice, {})
  @JoinColumn({ name: "paymentDeviceId" })
  paymentDevice: PaymentDevice;

  @Column()
  expiresAt: string;

  @Column({ type: "money" })
  monthlyCost: number;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ nullable: true })
  modifiedAt: string | null;
}