import express from 'express';
import userRoutes from './user/routes/userRoutes';
import logger from './config/logger';
import connectToDatabase from './config/connectToDatabase';
import errorHandleMiddleware from './middleware/errorHandleMiddleware';
import configKeys from './configKeys';

const app = express();

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);

app.use(errorHandleMiddleware);

const port = configKeys.PORT;

app.listen(port, () => {
  logger.info(`application is running at port ${port}`);
});
