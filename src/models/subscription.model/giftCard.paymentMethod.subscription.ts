import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Generated,
} from "typeorm";
import User from "../user.model/user.model";

@Entity({
  name: "GiftCard",
  schema: "Subscription",
})
export default class GiftCard {
  @PrimaryGeneratedColumn("uuid")
  giftCardId: string;

  //User by whom the gift card is activated
  @OneToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({
    name: "userId",
  })
  user: User | null;

  @Column("money")
  remainingAmount: number;

  @Generated("uuid")
  redeemedCode: string;

  @Column("boolean", {
    nullable: true,
  })
  status: boolean | null;

  @Column("text")
  design: string;
}
