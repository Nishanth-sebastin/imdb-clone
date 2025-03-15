import { Router, Request, Response, NextFunction } from 'express';
import { getUser } from '../services/userService.js';

interface AuthenticatedRequest<T = any> extends Request {
  user?: { user_id: string; name: string; email: string };
  body: T;
}

const router = Router();

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getUser(req.user);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
