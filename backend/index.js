import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import aminitiesRoutes from './routes/aminitiesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import developerRoutes from './routes/developerRoutes.js'
import nearesttoRoutes from './routes/nearesttoRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import subcategoryRoutes from './routes/subcategoryRoutes.js'
import userActivityRoutes from './routes/userActivityRoutes.js'
import featuredPropertyRoutes from './routes/featuredPropertyRoutes.js'
import faqRoutes from './routes/faqRoutes.js'
import minimumdetails from './routes/getminimumpropertyRoutes.js'

const app = express();

// Improved CORS configuration
const allowedOrigins = [
  'http://localhost:5173',                     // Development
  'https://realestatesand2sky.onrender.com',   // Production
  // Add any other domains your frontend might be hosted on
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("CORS blocked for origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Improved session configuration
const isProduction = process.env.NODE_ENV === 'production';
      
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 3600000, // 1 hour
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site requests in production
    secure: isProduction // true in production for HTTPS
  }
}));

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3003;

app.use('/api', aminitiesRoutes);
app.use('/api/admin', authRoutes);
app.use('/api', developerRoutes);
app.use('/api', nearesttoRoutes);
app.use('/api', propertyRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', blogRoutes);
app.use('/api', userActivityRoutes);
app.use('/api', featuredPropertyRoutes);
app.use('/api', faqRoutes);
app.use('/api', minimumdetails);

// Debug endpoint to check session
app.use('/api/check-session', (req, res) => {
  res.json({
    sessionExists: !!req.session.userId,
    userId: req.session.userId || null,
    role: req.session.role || null
  });
});

app.use('/test', (req, res) => {
  res.json({message: "hello hritesh"});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
});