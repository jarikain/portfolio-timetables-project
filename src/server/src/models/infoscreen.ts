import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Relation
} from 'typeorm';

export type ViewType = 'train' | 'bus' | 'info';
export type ThemeName = 'LAB' | 'LUT';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  ip: string;

  @ManyToOne(() => Location, (location) => location.devices, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'location_id' })
  location: Relation<Location>;
}

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'integer' })
  update_interval: number;

  @Column({ type: 'varchar', default: 'LAB' })
  theme: ThemeName;

  @OneToMany(() => Device, (device) => device.location, { cascade: true })
  devices: Relation<Device[]>;

  @OneToMany(() => View, (view) => view.location, { cascade: true })
  views: Relation<View[]>;
}

@Entity()
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: ViewType;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ManyToOne(() => Location, (location) => location.id)
  @JoinColumn({ name: 'location_id' })
  location: Relation<Location>;

  @OneToMany(() => Stop, (stop) => stop.view, { cascade: true })
  stops: Relation<Stop[]>;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;
}

@Entity()
export class Stop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'integer' })
  trips: number;

  @Column({ type: 'varchar' })
  stop_api_id: string;

  @Column({ type: 'varchar' })
  stop_name: string;

  @ManyToOne(() => View, (view) => view.id, { nullable: true })
  @JoinColumn({ name: 'view_id' })
  view: Relation<View>;
}
