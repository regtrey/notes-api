import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import MongoStore from 'connect-mongo';
import session from 'express-session';

import env from './utils/envValidator';
import notesRoutes from './routes/notesRoutes';
import usersRoutes from './routes/usersRoutes';
import { requiresAuth } from './middleware/authMiddleware';

const app = express();

app.use(
  cors({
    preflightContinue: true,
  })
);
app.use(morgan('dev'));

// Accept JSON bodies
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URL,
    }),
  })
);

app.use('/api/users', usersRoutes);
app.use('/api/notes', requiresAuth, notesRoutes);

// Accessing endpoints that does not exist
app.use((req, res, next) => {
  next(createHttpError(404, 'Endpoint not found'));
});

// Error handler
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = 'An unknown error occurred.';
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  return res.status(statusCode).json({
    error: errorMessage,
  });
});

export default app;
