import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Store } from './Store';

@Entity('store_owners')
export class StoreOwner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'user_id' })
  userId!: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'owner_code' })
  ownerCode!: string;

  // Relations
  @OneToOne(() => User, (user) => user.storeOwner)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Store, (store) => store.owner)
  stores!: Store[];
}
