import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8085;
const CLIENT_URL = process.env.HOST || 'http://localhost:8080';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => console.info(`🚀 Server running at ${CLIENT_URL}:${PORT}`));
