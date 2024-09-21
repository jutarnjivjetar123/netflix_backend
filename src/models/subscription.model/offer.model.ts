import {
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
} from "typeorm";

@Entity("Offer", {
  schema: "Subscription",
})
export default class Offer {
  @PrimaryGeneratedColumn({ name: "offerId" })
  offerId: number;

  @Column()
  offerTitle: string;

  @Column({ type: "money" })
  monthlyBillingAmount: number;

  @Column()
  maxNumberOfDevicesToWatch: number;

  @Column()
  maxNumberOfDevicesToDownload: number;

  @Column()
  maxResolution: number;

  @Column()
  isSpatialAudio: boolean;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({ nullable: true, type: "bigint" })
  modifiedAt: string | null;
}
