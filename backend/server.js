import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { setupSocketHandlers } from './sockets/socketHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import labelRoutes from './routes/labelRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import standupRoutes from './routes/standupRoutes.js';
import blockerRoutes from './routes/blockerRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import decisionLogRoutes from './routes/decisionLogRoutes.js';
import timeEntryRoutes from './routes/timeEntryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

// Connect to MongoDB
connectDB();

// Setup Socket.IO Event Handlers
setupSocketHandlers(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Attach Socket.IO instance to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/standups', standupRoutes);
app.use('/api/blockers', blockerRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/decisions', decisionLogRoutes);
app.use('/api/time', timeEntryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: true, message: 'FlowForge API Server active and healthy' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: false, message: `Route not found - ${req.originalUrl}` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.statusCode || 500).json({
    status: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 FlowForge API Server listening on port ${PORT}`);
  console.log(`📡 Socket.IO Real-time Engine running`);
  console.log(`=================================================`);
});
