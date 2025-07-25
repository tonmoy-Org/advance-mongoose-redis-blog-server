import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Application, Request, Response } from 'express';
import { BlogRoutes } from './app/modules/blog/blog.route';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));

// Parsers
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/v1/blogs', BlogRoutes);

// Root route
const getAController = (req: Request, res: Response) => {
  res.status(200).send('🚀 Welcome to the Advanced Mongoose + Redis Blog API');
};

app.get('/', getAController);

export default app;
