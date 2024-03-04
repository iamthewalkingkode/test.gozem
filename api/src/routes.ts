import { Express } from 'express';

// Import the controllers
import MainController from '@/controllers/main.controller';
import PackageController from '@/controllers/package.controller';
import DeliveryController from '@/controllers/delivery.controller';

// Define a function to set up routes in the Express app
const routes = (app: Express) => {
    // Use the MainController for the root route '/'
    app.use('/', MainController);

    // Use the PackageController for routes starting with '/api/package'
    app.use('/api/package', PackageController);

    // Use the DeliveryController for routes starting with '/api/delivery'
    app.use('/api/delivery', DeliveryController);
};

export default routes;