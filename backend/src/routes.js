import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import StoreController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Gympoint' }));
routes.post('/sessions', StoreController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);

export default routes;
