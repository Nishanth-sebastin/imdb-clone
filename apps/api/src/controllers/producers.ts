import { Router } from 'express';
import { createMovie } from '../services/movieService';
import { validateUser } from '../validations/userValidations';
import { getProducers } from 'src/services/producersService';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await getProducers();
        res.json({ data: users });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateUser, async (req, res, next) => {
    try {
        const newUser = await createMovie(req.body);
        res.status(201).json({ data: newUser });
    } catch (error) {
        next(error);
    }
});

export default router;
