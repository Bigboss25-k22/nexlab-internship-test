import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { StoreOwner } from './StoreOwner';
import { JobApplication } from './JobApplication';
import { Contract } from './Contract';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'owner_id' })
  ownerId!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo!: string | null;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 50, name: 'house_number' })
  houseNumber!: string;

  @Column({ type: 'varchar', length: 100 })
  street!: string;

  @Column({ type: 'varchar', length: 100 })
  ward!: string;

  @Column({ type: 'varchar', length: 100 })
  district!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relations
  @ManyToOne(() => StoreOwner, (storeOwner) => storeOwner.stores)
  @JoinColumn({ name: 'owner_id' })
  owner!: StoreOwner;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.store)
  jobApplications!: JobApplication[];

  @OneToMany(() => Contract, (contract) => contract.store)
  contracts!: Contract[];
}
