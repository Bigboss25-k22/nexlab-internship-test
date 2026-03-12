import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { StoreOwner } from './StoreOwner';
import { Freelancer } from './Freelancer';
import { RefreshToken } from './RefreshToken';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate!: Date | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: string;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relations
  @OneToOne(() => StoreOwner, (storeOwner) => storeOwner.user)
  storeOwner!: StoreOwner;

  @OneToOne(() => Freelancer, (freelancer) => freelancer.user)
  freelancer!: Freelancer;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];
}
