import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { PaymentMethodTypes } from "../../enums/PaymentMethod";
@Entity({
  name: "PaymentMethod",
  schema: "Subscription",
})
export default class PaymentMethod {
  @PrimaryGeneratedColumn("uuid")
  paymentMethodId: string;

  @Column({
    type: "enum",
    enum: PaymentMethodTypes,
    default: PaymentMethodTypes.CREDIT_DEBIT_CARD,
  })
  type: PaymentMethodTypes;

  @Column()
  serviceProvider: string;

  @Column()
  serviceProviderSvgLogo: string;

  @Column()
  serviceProviderWebsite: string;
}
