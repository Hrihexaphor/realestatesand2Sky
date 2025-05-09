import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import aminitiesRoutes from './routes/aminitiesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import developerRoutes from './routes/developerRoutes.js';
import nearesttoRoutes from './routes/nearesttoRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subcategoryRoutes from './routes/subcategoryRoutes.js';

import featuredPropertyRoutes from './routes/featuredPropertyRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import minimumdetails from './routes/getminimumpropertyRoutes.js';
import pagesRoutes from './routes/pagesRoutes.js';
import leadsRoutes from './routes/leadeGenaraterRoutes.js';
const app = express();

// ------------------ ✅ FIXED CORS SETUP ------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://realestatesand2sky.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request origin:', origin);

    // Allow non-browser tools (no origin)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.error('Origin blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ------------------ ✅ Middleware ------------------
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ------------------ ✅ SESSION SETUP ------------------
const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-fallback-secret',
  resave: false,
  saveUninitialized: false,
  name: 'realestate.sid',
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction
  }
};

app.use(session(sessionConfig));

// ------------------ ✅ Log every request ------------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies present:', !!req.headers.cookie);
  next();
});

// ------------------ ✅ ROUTES ------------------
app.use('/api', aminitiesRoutes);
app.use('/api/admin', authRoutes);
app.use('/api', developerRoutes);
app.use('/api', nearesttoRoutes);
app.use('/api', propertyRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', blogRoutes);
app.use('/api',leadsRoutes)
app.use('/api', featuredPropertyRoutes);
app.use('/api', faqRoutes);
app.use('/api',pagesRoutes)
app.use('/api', minimumdetails);

// Optional test route
app.get('/api/check-session', (req, res) => {
  res.json({
    hasSession: !!req.session,
    sessionID: req.sessionID || null,
    user: req.session?.user || null,
    cookieHeader: req.headers.cookie || null,
    origin: req.headers.origin || null,
  });
});

app.use('/test', (req, res) => {
  res.json({ message: 'hello hritesh' });
});

// ------------------ ✅ Start Server ------------------
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
});
