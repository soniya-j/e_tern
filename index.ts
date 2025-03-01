import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './user/routes/userRoutes';
import activityRoutes from './activities/routes/activityRoute';
import packageRoutes from './package/routes/packageRoutes';
import categoryRoutes from './category/routes/categoryRoutes';
import subCategoryRoutes from './subcategory/routes/subCategoryRoutes';
import packageCostRoutes from './packagecost/routes/packageCostRoutes';
import courseMaterialRoutes from './coursematerial/routes/courseMaterialRoutes';
import studentRoutes from './student/routes/studentRoutes';
import subscriptionRoutes from './subscription/routes/subscriptionRoutes';

import logger from './config/logger';
import connectToDatabase from './config/connectToDatabase';
import errorHandleMiddleware from './middleware/errorHandleMiddleware';
import configKeys from './configKeys';
import setupSwagger from './swaggerdocs/swaggerConfig';
import path from 'path';

const app = express();

connectToDatabase();

//Newly added
// Serve the upload folder statically
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

// Dynamic CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
//end

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subCategoryRoutes);
app.use('/api/packagecost', packageCostRoutes);
app.use('/api/coursematerial', courseMaterialRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/subscription', subscriptionRoutes);

app.use(errorHandleMiddleware);

const port = configKeys.PORT;

app.listen(port, () => {
  logger.info(`application is running at port ${port}`);
  setupSwagger(app, port);
});
