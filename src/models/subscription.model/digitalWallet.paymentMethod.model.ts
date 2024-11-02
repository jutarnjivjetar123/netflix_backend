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
import User from "../../models/user.model/user.model";

@Entity({
  name: "DigitalWallet",
  schema: "Subscription",
})
export default class DigitalWallet {
  @PrimaryGeneratedColumn("uuid")
  digitalWalletId: string;

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
  walletId: string;

  @Column()
  email: string;

  @Column()
  walletLink: string;

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
