import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roomRoutes from './routes/room.routes.js';
import messageRoutes from './routes/message.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { initializeSocket } from './socket/socket.handler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StreamChat Backend</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #0f172a;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: #1e293b;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-width: 500px;
          width: 90%;
        }
        h1 {
          color: #38bdf8;
          margin-bottom: 1rem;
        }
        p {
          line-height: 1.6;
          color: #94a3b8;
        }
        .status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #059669;
          color: white;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>StreamChat Backend</h1>
        <p>This is the backend API service for the StreamChat application.</p>
        <p>The server is up and running.</p>
        <div class="status">System Operational</div>
      </div>
    </body>
    </html>
  `);
});
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Error handling
app.use(errorHandler);

// Initialize Socket.io
initializeSocket(io);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log('🚀 StreamChat Backend');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔌 Socket.io ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    mongoose.connection.close();
  });
});
