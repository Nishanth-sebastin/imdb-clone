import { Router } from 'express';
import actorRoutes from './controllers/actors';
import movieRoutes from './controllers/movies';
import producerRoutes from './controllers/producers';
import userRoutes from './controllers/user';

const router = Router();

router.use('/actors', actorRoutes);
router.use('/movies', movieRoutes);
router.use('/producers', producerRoutes);
router.use('/me', userRoutes);
export default router;
