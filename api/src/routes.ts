import { Express } from 'express';

// ::: controllers
import MainController from '@/controllers/main.controller';
import PackageController from '@/controllers/package.controller';
import DeliveryController from '@/controllers/delivery.controller';


const routes = (app: Express) => {
    app.use('/', MainController);
    app.use('/api/package', PackageController);
    app.use('/api/delivery', DeliveryController);
};

export default routes;