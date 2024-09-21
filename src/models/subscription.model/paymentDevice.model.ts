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

  @Column({ type: "bigint" })
  expirationDate: string;

  @Column()
  cardType: boolean;

  @Column()
  serviceProvider: string;

  @Column()
  billingAddress: string;

  @Column()
  isDefault: boolean;

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

  @Column({ type: "bigint", nullable: true })
  modifiedAt: string | null;
}
