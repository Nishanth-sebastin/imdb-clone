import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { JOHN, HelloWorldType } from '@repo/commons';
import { prisma } from '@repo/db';
dotenv.config();
const app = express();
const HOST = process.env.HOST || 'http://localhost';
const API_PORT = Number(process.env.API_PORT) || 8085;
const WEB_PORT = Number(process.env.WEB_PORT) || 8080;
const CLIENT_URL = `${HOST}:${WEB_PORT}`;
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.get('/helloWorld', (_: Request, response: Response, next: NextFunction) => {
  try {
    const helloWorld: HelloWorldType = {
      name: JOHN,
      welcome: 'Hello world',
    };
    response.json({ data: helloWorld });
  } catch (error) {
    next(error);
  }
});
app.get('/users', async (_: Request, response: Response, next: NextFunction) => {
  try {
    const users = await prisma.actor.findMany();
    response.json({ data: users });
  } catch (error) {
    next(error);
  }
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(API_PORT, () => console.info(`API Server running at ${HOST}:${API_PORT}`));
