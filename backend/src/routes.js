import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import StoreController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Gympoint' }));
routes.post('/sessions', StoreController.store);

routes.use(authMiddleware);

routes.post('/sessions', StoreController.store);

export default routes;
