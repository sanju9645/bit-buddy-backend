# bit-buddy-backend
Zap your files across the web, no middleman!

# 🧠 Backend Setup Guide

This guide outlines the steps to set up, configure, and deploy the backend for your project.

---

## ⚙️ Initialization

```bash
npm init -y
```

---

## 📦 Install Dependencies

### ✅ Production Dependencies

```bash
npm i cors express peer socket.io helmet dotenv
```

### 🧪 Development Dependencies

```bash
npm i -D @types/cors @types/express @types/node nodemon ts-node typescript
```

---

## 🛠️ Environment Configuration

> Create a `.env` file in the root of your project and add the following variables:

```env
# 🌐 Server
PORT=8000
PEER_PORT=9000
```


## 🧱 TypeScript Configuration

1. Initialize the TypeScript project:

```bash
npx tsc --init
```

2. Create a `src` folder and add a `server.ts` file.

3. Update your `package.json`:

```json
"main": "./src/server.ts",
"scripts": {
  "dev": "nodemon",
  "build": "npm install && npx tsc",
  "start": "node dist/server.js"
}
```

3. Update your `server.ts`:
```ts
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

```

4. Create and update the 'nodemon.json' file  
```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "ts-node ./src/server.ts"
}
```

5. Run the dev server:

```bash
npm run dev
```

6. ✅ **Verify the server is running** by visiting:

```http
http://localhost:3000/health
```

7. Modify `tsconfig.json`:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

----------------------------------------------------------------------------


## 🚀 Deployment

### 1. Update `tsconfig.json`

Ensure your `tsconfig.json` contains the following configuration:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    ...
  }
}
```

---

### 2. Update `package.json` Scripts

Make sure your `package.json` includes the following scripts:

```json
"scripts": {
  "dev": "nodemon",
  "build": "npm install && npx tsc",
  "start": "node dist/server.js",
  ...
}
```

---

### 3. Build the Project

```bash
npm run build
```

This will compile the TypeScript files and create a `dist` folder.

---

### 4. Start the Server

```bash
npm start
```

Your server should now be running on **port 3000**.

---

### 5. Deploy on [Render](https://render.com)

1. Go to [render.com](https://render.com)
2. Click on **"New Web Service"**
3. Connect your GitHub repository
4. Fill in the details:

   * **Name:** `bit-buddy-backend`
   * **Project:** `Bit Buddy`
   * **Language:** `Node`
   * **Branch:** `Production`
   * **Region:** `Oregon (US West)`
   * **Root Directory (Optional):** leave blank
   * **Build Command:** `npm run build`
   * **Start Command:** `npm start`
5. **Add Environment Variables** as required

---
