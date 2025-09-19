import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import AppDataSource from './config/db.js';
import cors from 'cors';
import mysqlSession from 'express-mysql-session';
import { Server } from 'socket.io';
import http from 'http';
import webpush from 'web-push';
import { fileURLToPath } from 'url';

// All of the routers import here
import dataRouter from './Routes/data.js';
import usersRouter from './Routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PROD_FRONTEND = process.env.CLIENT_ORIGIN || 'https://airbnb-frontend-sooty.vercel.app';
const PROD_BACKEND = process.env.SERVER_ORIGIN || 'https://dynamic-tranquility-production.up.railway.app';
const allowedOrigins = [PROD_FRONTEND, PROD_BACKEND];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  },
});

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
if (isProd && (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY)) {
  console.warn('VAPID keys are missing in production. Web push will not work correctly.');
}
webpush.setVapidDetails(
  'mailto:hamzanadeem2398@gmail.com',
  VAPID_PUBLIC_KEY || 'BP0OJzfIv3gutn2bu2VbP3Y062ZYRhtLNiYxxDe_OM1aueh7bJKcx5S72UzsRs40kFsukwOxfV13oTUJo-3vOFU',
  VAPID_PRIVATE_KEY || 'FrHS98ZYC1XfvaAxRTklh0ssn492LDTSLA07pUkwQS8'
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

if (isProd) {
  app.use((req, res, next) => {
    const origin = req.headers.origin || '';
    if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|$)/.test(origin)) {
      return res.status(403).json({ error: 'Localhost origin not allowed in production' });
    }
    next();
  });
}

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/icons', express.static(path.join(process.cwd(), 'public', 'icons')));
app.use(express.static(path.join(process.cwd(), 'public')));
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
});

app.set('trust proxy', 1);

app.use(
  session({
    name: process.env.SESSION_NAME || 'sid',
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    },
  })
);

// Routes
app.use('/api/users', usersRouter);
app.use('/api/data', dataRouter);

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join-room', (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    if (!roomId) return;
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  // Handle incoming messages and broadcast to the conversation room
  socket.on('message', (data) => {
    const { conversationId, message, senderId } = data || {};

    if (!conversationId || !message) return;

    console.log(`Message in room ${conversationId} from ${senderId}: ${message}`);

    io.to(conversationId).emit('message', {
      conversationId,
      message,
      senderId,
      createdAt: new Date()
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected. Reason:`, reason);
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to the database');

    const port = Number(process.env.PORT) || 5000;

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });