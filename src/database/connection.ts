import { createConnection } from 'typeorm';
import ormConfig from '../../ormconfig';

export default async () => {
  await createConnection(ormConfig);
};
