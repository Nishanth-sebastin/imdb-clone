import { Request, Response } from 'express';

export function errorHandler(err: Error, req: Request, res: Response) {
  console.log(err);
  res.status(500).json({ error: 'Internal Server Error' });
}
