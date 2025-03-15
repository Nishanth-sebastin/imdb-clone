import { NextFunction, Request, Response, Router } from 'express';
import { getActors, getActorById } from '../services/actorsService';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchText = (req.query.search as string) || '';
    const actors = await getActors(searchText);
    const formattedActors = actors.map((actor: any) => ({
      id: actor._id,
      name: actor.name,
    }));

    res.json({ data: formattedActors });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = await getActorById(req.params.id);
    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }
    const formattedActor = {
      id: actor._id,
      name: actor.name,
      imageUrl: actor.imageUrl ?? null,
    };
    res.json({ data: formattedActor });
  } catch (error) {
    next(error);
  }
});

export default router;
