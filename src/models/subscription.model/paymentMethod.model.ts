import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { PaymentMethodTypes } from "../../utilities/other.utility";

@Entity({
  name: "PaymentMethod",
  schema: "Subscription",
})
export default class PaymentMethod {
  @PrimaryGeneratedColumn("increment")
  paymentMethodId: number;

  @Column({
    type: "enum",
    enum: PaymentMethodTypes,
  })
  methodType: PaymentMethodTypes;

  @Column()
  serviceProviderName: string;

  @Column({
    nullable: true,
  })
  serviceProviderLogo: string | null;

  @Column({ nullable: true })
  serviceProviderWebsite: string | null;

  @Column({ default: true })
  isImplemented: boolean;
}
