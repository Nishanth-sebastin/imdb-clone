import { Router } from 'express';
import actorRoutes from './controllers/actors.js';
import movieRoutes from './controllers/movies.js';
import producerRoutes from './controllers/producers.js';
import userRoutes from './controllers/user.js';
import authMiddleware from './middlewares/auth.js';

const router = Router();

router.use('/actors', authMiddleware, actorRoutes);
router.use('/movies', movieRoutes);
router.use('/producers', authMiddleware, producerRoutes);
router.use('/me', authMiddleware, userRoutes);
export default router;
