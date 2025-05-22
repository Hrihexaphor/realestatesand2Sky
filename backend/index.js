import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import apiRouter from './routes/index.js';

const app = express();

// ------------------ ✅ FIXED CORS SETUP ------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://realestatesand2-sky.vercel.app',
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
  secret: process.env.SESSION_SECRET || 'Session_Secret_1234',
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

app.set('trust proxy', 1); // Trust first proxy for render.com

// ------------------ ✅ Log every request ------------------
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies present:', !!req.headers.cookie);
  next();
});

// ------------------ ✅ ROUTES ------------------
app.use('/api', apiRouter);

app.use('/test', (req, res) => {
  res.json({ message: 'hello hritesh', environment: process.env.NODE_ENV });
});

// ------------------ ✅ Start Server ------------------
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
});
