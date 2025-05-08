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
  'http://localhost:5173',  
  ' http://localhost:3000',                   // Development
  'https://realestatesand2sky.onrender.com',   // Production
  // Add any other domains your frontend might be hosted on
];
console.log('Allowed origins:', allowedOrigins);
app.use(cors({
  origin: function(origin, callback) {
    console.log('Request origin:', origin);
    
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) {
      console.log('No origin, allowing request');
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

app.use(express.json());

// Improved session configuration
const isProduction = process.env.NODE_ENV === 'production';
      
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-fallback-secret',
  resave: false,
  saveUninitialized: false,
  name: 'realestate.sid', // Custom name to avoid default
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Configure cookie settings based on environment
if (isProduction) {
  // Production settings - for cross-domain cookies
  sessionConfig.cookie.sameSite = 'none';
  sessionConfig.cookie.secure = true; // Required for sameSite=none
  
  console.log('Using production cookie settings: sameSite=none, secure=true');
} else {
  // Development settings
  sessionConfig.cookie.sameSite = 'lax';
  sessionConfig.cookie.secure = false;
  
  console.log('Using development cookie settings: sameSite=lax, secure=false');
}
app.use(session(sessionConfig));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies present:', !!req.headers.cookie);
  next();
});
app.use('/uploads', express.static('uploads'));



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
app.get('/api/check-session', (req, res) => {
  // Display complete session information
  res.json({
    // Session existence check
    hasSession: !!req.session,
    sessionID: req.sessionID || null,
    
    // User data checks - both possible formats
    user: req.session?.user || null,
    userId: req.session?.userId || null,
    
    // Role checks - both possible formats
    userRole: req.session?.user?.role || null,
    directRole: req.session?.role || null,
    
    // Cookie information
    hasCookies: !!req.headers.cookie,
    cookieHeader: req.headers.cookie || null,
    
    // Request information
    origin: req.headers.origin || null,
    host: req.headers.host || null,
    
    // Session data (sanitized)
    sessionData: req.session ? 
      Object.keys(req.session).filter(key => key !== 'cookie').reduce((obj, key) => {
        obj[key] = req.session[key];
        return obj;
      }, {}) : null
  });
});

app.use('/test', (req, res) => {
  res.json({message: "hello hritesh"});
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
});