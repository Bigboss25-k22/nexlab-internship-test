import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Store } from './Store';
import { Freelancer } from './Freelancer';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'store_id' })
  storeId!: number;

  @Column({ type: 'int', name: 'freelancer_id' })
  freelancerId!: number;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relations
  @ManyToOne(() => Store, (store) => store.jobApplications)
  @JoinColumn({ name: 'store_id' })
  store!: Store;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.jobApplications)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer!: Freelancer;
}
