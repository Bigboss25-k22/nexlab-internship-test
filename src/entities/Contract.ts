import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Freelancer } from './Freelancer';
import { Store } from './Store';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'freelancer_id' })
  freelancerId!: number;

  @Column({ type: 'int', name: 'store_id' })
  storeId!: number;

  @Column({ type: 'date', name: 'start_date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate!: Date | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string;

  // Relations
  @ManyToOne(() => Freelancer, (freelancer) => freelancer.contracts)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer!: Freelancer;

  @ManyToOne(() => Store, (store) => store.contracts)
  @JoinColumn({ name: 'store_id' })
  store!: Store;
}
