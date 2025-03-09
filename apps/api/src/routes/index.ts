import { Router } from 'express';
import userRoutes from './users';
import movieRoutes from './movies';

const router = Router();

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

export default router;
