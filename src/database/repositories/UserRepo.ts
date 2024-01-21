import { FindCondition, FindConditions } from 'typeorm';
import { Runner, getRepositoryWithQueryRunner } from '.';
import User from '../entities/User';

export default class UserRepo {
  private static readonly getRepository = (qr?: Runner) => getRepositoryWithQueryRunner(User, qr);

  public static getUserById = async (id: string, qr?: Runner) => UserRepo.getRepository(qr).findOne(id, {});

  public static getUserByClause = async (clause: FindCondition<User>, relations?: string[], qr?: Runner) => {
    return UserRepo.getRepository(qr).findOne({
      where: clause,
      relations,
    });
  };

  public static getUserByEmail = async (email: string, qr?: Runner) =>
    UserRepo.getRepository(qr).findOne({
      where: {
        email,
      },
    });

  public static createUser = async (user: Partial<User>, qr?: Runner) => UserRepo.getRepository(qr).save(user);

  public static updateUserById = async (id: string, updates: Partial<User>, qr?: Runner) => {
    await UserRepo.getRepository(qr).update(id, updates);
    return UserRepo.getUserById(id);
  };
}
