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

  @Column()
  offerSubtitle: string;

  @Column({ type: "money" })
  monthlyBillingAmount: number;

  @Column()
  maxNumberOfDevicesToDownload: number;

  @Column()
  maxNumberOfDevicesToWatch: number;

  @Column()
  resolutionQuality: string;
  @Column()
  resolutionDescription: string;

  @Column()
  supportedDevices: string;
  @Column()
  isSpatialAudio: boolean;

  @Column()
  offerColor: string;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({ nullable: true, type: "bigint" })
  modifiedAt: string | null;
}
