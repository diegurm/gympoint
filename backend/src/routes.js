import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StoreController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Gympoint' }));
routes.post('/users', UserController.store);

routes.post('/sessions', StoreController.store);

export default routes;
