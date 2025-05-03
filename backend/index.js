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
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json())

// session config 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
      sameSite: 'lax', // or 'none' if using HTTPS
      secure: false // set true only in production with HTTPS
    }
  }));  
app.use('/uploads',express.static('uploads'))
const PORT = process.env.PORT||3003

app.use('/api',aminitiesRoutes);
app.use('/api/admin',authRoutes)
// developer routes add
app.use('/api',developerRoutes)
app.use('/api',nearesttoRoutes)
app.use('/api',propertyRoutes)
app.use('/api',categoryRoutes)
app.use('/api',subcategoryRoutes)
app.use('/api',blogRoutes)
app.use('/api',userActivityRoutes)
app.use('/api',featuredPropertyRoutes)
app.use('/api',faqRoutes)
app.use('/test',(req,res)=>{
  res.json({message:"hello hritesh"})
})
app.listen(PORT, () => {  
    console.log(`Server running on port ${PORT}`);     
}
)
