import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;
}
