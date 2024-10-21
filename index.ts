import express from 'express';
import userRoutes from './user/routes/userRoutes';
import activityRoutes from './activities/routes/activityRoute';
import packageRoutes from './package/routes/packageRoutes';
import categoryRoutes from './category/routes/categoryRoutes';
import subCategoryRoutes from './subcategory/routes/subCategoryRoutes';
import packageCostRoutes from './packagecost/routes/packageCostRoutes';
import courseMaterialRoutes from './coursematerial/routes/courseMaterialRoutes';

import logger from './config/logger';
import connectToDatabase from './config/connectToDatabase';
import errorHandleMiddleware from './middleware/errorHandleMiddleware';
import configKeys from './configKeys';
import setupSwagger from './swaggerdocs/swaggerConfig';

const app = express();

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subCategoryRoutes);
app.use('/api/packagecost', packageCostRoutes);
app.use('/api/coursematerial', courseMaterialRoutes);

app.use(errorHandleMiddleware);

const port = configKeys.PORT;

app.listen(port, () => {
  logger.info(`application is running at port ${port}`);
  setupSwagger(app, port);
});
