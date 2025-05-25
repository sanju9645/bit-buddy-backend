import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import config from "./config";
import SocketService from "./services/socketService";
import PeerService from "./services/peerService";
import { rootHandler, healthCheckHandler } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

/**
 * -------------- MIDDLEWARES ----------------
 */
// Basic logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SERVER ----------------
 */
const server = app.listen(config.PORT, () => {
  console.log(`Server started on http://localhost:${config.PORT}`);
  console.log(`Health check available at http://localhost:${config.PORT}/health`);
  console.log(`Root endpoint available at http://localhost:${config.PORT}/`);
  console.log(`PeerJS server is running on port ${config.PEER_PORT}`);
});


/**
 * -------------- Initialize services ----------------
 */
new SocketService(server);
new PeerService();


/**
 * -------------- ROUTES ----------------
 */
app.get("/", rootHandler);
app.get("/health", healthCheckHandler);


/**
 * -------------- ERROR HANDLING MIDDLEWARE ----------------
 */
app.use(errorHandler);
app.use(notFoundHandler);


// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
