import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import StoreController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Gympoint' }));
routes.post('/sessions', StoreController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
