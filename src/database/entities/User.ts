import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';

import GenericEntity from './generic';
import { UserRole } from './enum';

// eslint-disable-next-line
import Organization from './Organization';

@Entity()
export default class User extends GenericEntity {
  static sensitive = ['password'];

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToMany(() => Organization, (org) => org.users)
  @JoinTable()
  organizations: Organization[];
}
