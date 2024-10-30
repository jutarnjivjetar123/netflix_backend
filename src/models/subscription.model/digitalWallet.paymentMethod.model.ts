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
  name: "DigitalWallet",
  schema: "Subscription",
})
export default class DigitalWallet {
  @PrimaryGeneratedColumn("uuid")
  digitalWalletId: string;
  @ManyToOne(() => PaymentMethod)
  @JoinColumn({
    name: "paymentMethodId",
  })
  @Column()
  walletId: string;

  @Column()
  email: string;

  @Column()
  walletLink: string;
}
