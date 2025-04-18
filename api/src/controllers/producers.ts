import { NextFunction, Request, Response, Router } from 'express';
import { getProducerById, getProducers } from '../services/producersService.js';
const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchText = (req.query.search as string) || '';
    const producers = await getProducers(searchText);
    const formattedProducers = producers.map((producer: any) => ({
      id: producer.id,
      name: producer.name,
    }));
    res.json({ data: formattedProducers });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const producer = await getProducerById(req.params.id);
    if (!producer) {
      return res.status(404).json({ error: 'Producer not found' });
    }
    const formattedProducer = {
      id: producer.id,
      name: producer.name,
      imageUrl: producer.imageUrl ?? null,
    };
    res.json({ data: formattedProducer });
  } catch (error) {
    next(error);
  }
});
export default router;
