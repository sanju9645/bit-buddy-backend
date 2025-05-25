import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

/**
 * -------------- GENERAL SETUP ----------------
 */
const PORT: number = parseInt(process.env.PORT || '8000', 10);

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
 * -------------- ROUTES ----------------
 */
// Root route for testing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  console.log("Health check endpoint hit");
  res.status(200).json({ 
    status: "success",
    message: "Server is healthy!",
    timestamp: new Date().toISOString()
  });
});

/**
 * -------------- ERROR HANDLING MIDDLEWARE ----------------
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.url}`
  });
});

/**
 * -------------- SERVER ----------------
 */
const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Root endpoint available at http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
