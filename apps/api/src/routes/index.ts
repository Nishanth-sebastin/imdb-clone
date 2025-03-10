import { Router } from 'express';
import userRoutes from './users';
import movieRoutes from './movies';
import actorRoutes from './actors';
import producerRoutes from './producers';


const router = Router();

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/actors', actorRoutes);
router.use('/producers', producerRoutes);
export default router;
