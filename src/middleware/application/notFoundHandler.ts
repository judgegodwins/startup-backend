import { type Request, type Response } from 'express';

export default (req: Request, res: Response): Response =>
  res.status(404).send({
    status: 'error',
    message: 'endpoint not found',
  });
