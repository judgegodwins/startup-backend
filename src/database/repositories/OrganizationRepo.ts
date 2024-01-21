import { FindCondition, FindConditions } from 'typeorm';
import { Runner, getRepositoryWithQueryRunner } from '.';
import Organization from '../entities/Organization';

export default class OrganizationRepo {
  private static readonly getRepository = (qr?: Runner) => getRepositoryWithQueryRunner(Organization, qr);

  public static getOrganizationById = async (id: string, qr?: Runner) =>
    OrganizationRepo.getRepository(qr).findOne(id, {});

  public static getOrganizationByClause = async (
    clause: FindCondition<Organization>,
    relations?: string[],
    qr?: Runner
  ) => {
    return OrganizationRepo.getRepository(qr).findOne({
      where: clause,
      relations,
    });
  };

  public static getOrganizationsByClause = async (
    clause: FindConditions<Organization>,
    relations?: string[],
    qr?: Runner
  ) => {
    return OrganizationRepo.getRepository(qr).find({
      where: clause,
      relations,
    });
  };

  public static searchOrganizations = async (search: string, qr?: Runner) => {
    return OrganizationRepo.getRepository(qr)
      .createQueryBuilder('org')
      .select()
      .where(`MATCH(name) AGAINST (:value IN NATURAL LANGUAGE MODE)`, { value: search })
      .orWhere('MATCH(description) AGAINST (:value IN NATURAL LANGUAGE MODE)', { value: search })
      .getMany();
  };

  public static createOrganization = async (data: Partial<Organization>, qr?: Runner) =>
    OrganizationRepo.getRepository(qr).save(data);

  public static updateOrganizationById = async (id: string, updates: Partial<Organization>, qr?: Runner) => {
    await OrganizationRepo.getRepository(qr).update(id, updates);
    return OrganizationRepo.getOrganizationById(id);
  };
}
