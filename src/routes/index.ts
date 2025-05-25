import { Request, Response } from 'express';

// Root route for testing
export const rootHandler = (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
};

// Health check route
export const healthCheckHandler = (req: Request, res: Response) => {
  console.log("Health check endpoint hit");
  res.status(200).json({ 
    status: "success",
    message: "Server is healthy!",
    timestamp: new Date().toISOString()
  });
}; 