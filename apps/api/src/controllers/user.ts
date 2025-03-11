import { Router } from 'express';
import { getUser } from 'src/services/userService';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await getUser(req.user);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});
export default router;
