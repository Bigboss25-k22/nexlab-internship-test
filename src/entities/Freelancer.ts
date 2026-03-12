import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { JobApplication } from './JobApplication';
import { Contract } from './Contract';

@Entity('freelancers')
export class Freelancer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'house_number' })
  houseNumber!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  street!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ward!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city!: string | null;

  // Relations
  @OneToOne(() => User, (user) => user.freelancer)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.freelancer)
  jobApplications!: JobApplication[];

  @OneToMany(() => Contract, (contract) => contract.freelancer)
  contracts!: Contract[];
}
