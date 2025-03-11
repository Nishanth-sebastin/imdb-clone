import { Router } from 'express';
import { getMovies, createMovie } from '../services/movieService';
import { validateUser } from '../validations/userValidations';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await getMovies();
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
