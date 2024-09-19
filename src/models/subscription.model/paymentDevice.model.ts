import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "../user.model/user.model";
@Entity({
  name: "PaymentDevice",
  schema: "Subscription",
})
export default class PaymentDevice {
  @PrimaryGeneratedColumn("uuid")
  paymentDeviceId: string;

  @ManyToOne((type) => User, {})
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  cardholderName: string;

  @Column()
  lastFourDigits: string;

  @Column()
  expirationDate: Date;

  @Column()
  cardType: boolean;

  @Column()
  serviceProvider: string;

  @Column()
  billingAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}
