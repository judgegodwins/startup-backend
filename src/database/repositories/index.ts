import { EntityManager, EntityTarget, getRepository, ObjectLiteral, QueryRunner, Repository } from 'typeorm';

export type Runner = QueryRunner | EntityManager;
export const getRepositoryWithQueryRunner = <T extends ObjectLiteral>(
  entity: EntityTarget<T>,
  qr?: Runner
): Repository<T> => {
  // return qr ? qr.manager.getRepository(entity) : getRepository(entity);
  if (!qr) return getRepository(entity);
  if (qr instanceof EntityManager) return qr.getRepository(entity);
  return qr.manager.getRepository(entity);
};
