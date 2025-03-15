import { Router } from 'express';
import actorRoutes from './controllers/actors';
import movieRoutes from './controllers/movies';
import producerRoutes from './controllers/producers';
import userRoutes from './controllers/user';
import authMiddleware from './middlewares/auth';

const router = Router();

router.use('/actors', authMiddleware, actorRoutes);
router.use('/movies', movieRoutes);
router.use('/producers', authMiddleware, producerRoutes);
router.use('/me', authMiddleware, userRoutes);
export default router;
