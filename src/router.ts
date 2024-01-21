import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import modulesV1 from './modules-v1';

const router = Router();

router.get('/version', (req, res) => {
  return res.send({
    status: 'success',
    data: {
      // eslint-disable-next-line import/no-dynamic-require
      version: require(path.join(process.cwd(), 'package.json')).version,
    },
  });
});

router.get('/healthz', (req, res) => {
  return res.send();
});

router.get('/readyz', (req, res) => {
  if ((global as any).isShuttingDown || (global as any).isStartingUp) {
    return res.status(500).send();
  }
  return res.send();
});

router.get('/docs-json', (req, res) => {
  const docs = path.join(__dirname, '..', 'docs', 'endpoint.json');
  if (!fs.existsSync(docs)) return res.status(404).send('docs not found');
  return res.sendFile(docs);
});

router.get('/docs', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'docs', 'index.html'));
});

router.use('/v1', modulesV1);

export default router;
