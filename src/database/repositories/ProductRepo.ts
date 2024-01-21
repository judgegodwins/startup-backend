import { FindCondition, FindConditions } from 'typeorm';
import { Runner, getRepositoryWithQueryRunner } from '.';
import Product from '../entities/Product';

export default class ProductRepo {
  private static readonly getRepository = (qr?: Runner) => getRepositoryWithQueryRunner(Product, qr);

  public static getProductById = async (id: string, qr?: Runner) => ProductRepo.getRepository(qr).findOne(id, {});

  public static getProductByClause = async (clause: FindCondition<Product>, relations?: string[], qr?: Runner) => {
    return ProductRepo.getRepository(qr).findOne({
      where: clause,
      relations,
    });
  };

  public static getProductsByClause = async (clause: FindConditions<Product>, relations?: string[], qr?: Runner) => {
    return ProductRepo.getRepository(qr).find({
      where: clause,
      relations,
    });
  };

  public static createProduct = async (data: Partial<Product>, qr?: Runner) => ProductRepo.getRepository(qr).save(data);

  public static updateProductById = async (id: string, updates: Partial<Product>, qr?: Runner) => {
    await ProductRepo.getRepository(qr).update(id, updates);
    return ProductRepo.getProductById(id);
  };

  // public static updateProductByClause = async (clause: FindCondition<Product>, updates: Partial<Product>, qr?: Runner) => {
  //   await ProductRepo.getRepository(qr).update({}, updates);
  //   return ProductRepo.getProductById(id);
  // };
}
