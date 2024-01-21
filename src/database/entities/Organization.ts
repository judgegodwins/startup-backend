import { Entity, Column, ManyToMany, Index } from 'typeorm';

import GenericEntity from './generic';

// eslint-disable-next-line
import User from './User';
import { OrganizationType } from './enum';

@Entity()
export default class Organization extends GenericEntity {
  static sensitive = ['password'];

  @Index({ fulltext: true })
  @Column()
  name: string;

  @Column()
  yearFounded: Date;

  @Index({ fulltext: true })
  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'varchar' })
  logo: string | null;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true, type: 'enum', enum: OrganizationType })
  type: OrganizationType;

  @ManyToMany(() => User, (user) => user.organizations)
  users: User[];
}
