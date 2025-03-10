import { Router } from 'express';
import { getActors, createActor } from '../services/actorsService';
import { validateUser } from '../validations/userValidations';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const actors = await getActors();
        res.json({ data: actors });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateUser, async (req, res, next) => {
    try {
        const newActor = await createActor(req.body);
        res.status(201).json({ data: newActor });
    } catch (error) {
        next(error);
    }
});

export default router;
