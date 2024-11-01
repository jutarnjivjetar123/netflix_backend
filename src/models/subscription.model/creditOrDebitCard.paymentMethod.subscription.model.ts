import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import PaymentMethod from "./paymentMethod.model";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";

import User from "../user.model/user.model";
@Entity({
  name: "CreditOrDebitCard",
  schema: "Subscription",
})
export default class CreditOrDebitCard {
  @PrimaryGeneratedColumn("uuid")
  creditOrDebitCardId: string;

  @ManyToOne(() => User)
  @JoinColumn({
    name: "userId",
  })
  user: User;
  @ManyToOne(() => PaymentMethod)
  @JoinColumn({
    name: "paymentMethodId",
  })
  paymentMethod: PaymentMethod;

  @Column()
  cardNumber: string;

  @Column()
  ccv: number;

  @Column("bigint")
  expiryDate: string;

  @Column()
  nameOnCard: string;

  @Column({
    default: false,
  })
  isDefaultForUser: boolean;
  @Column("bigint")
  createdAt: string;

  @Column("bigint", {
    nullable: true,
  })
  modifiedAt: string | null;
}
