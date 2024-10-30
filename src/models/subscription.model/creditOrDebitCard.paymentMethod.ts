import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import PaymentMethod from "./paymentMethod.model";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";

@Entity({
  name: "CreditOrDebitCard",
  schema: "Subscription",
})
export default class CreditOrDebitCard {
  @PrimaryGeneratedColumn("uuid")
  creditOrDebitCardId: string;

  
  @ManyToOne(() => PaymentMethod)
  @JoinColumn({
    name: "paymentMethodId",
  })
  paymentMethod: PaymentMethod;

  @Column()
  cardNumber: string;

  @Column()
  ccv: string;

  @Column()
  expiryDate: Date;

  @Column()
  nameOnCard: string;
}
