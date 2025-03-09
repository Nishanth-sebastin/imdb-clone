import { Router } from 'express';
import { getUsers, createUser } from '../services/userService';
import { validateUser } from '../validations/userValidations';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await getUsers();
        res.json({ data: users });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateUser, async (req, res, next) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json({ data: newUser });
    } catch (error) {
        next(error);
    }
});

export default router;
