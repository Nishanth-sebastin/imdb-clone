import { Router } from 'express';
import { getActors, createActor, getActorById } from '../services/actorsService';
import { validateUser } from '../validations/userValidations';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const searchText = req.query.search || '';
    const actors = await getActors(searchText);
    const formattedActors = actors.map((actor) => ({
      id: actor._id,
      name: actor.name,
    }));

    res.json({ data: formattedActors });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
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
