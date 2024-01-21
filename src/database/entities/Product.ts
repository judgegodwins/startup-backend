import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import GenericEntity from './generic';
import { ProductType } from './enum';
import Organization from './Organization';

@Entity()
export default class Product extends GenericEntity {
  static sensitive = ['password'];

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  imageKeys: string[];

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  organizationId: string;
}
