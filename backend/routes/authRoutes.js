import express from 'express';
import bcrypt from 'bcryptjs';
import { findAdmiByEmail,createAdmin } from '../services/adminServices.js';    

const router = express.Router();
router.post('/signup', async (req, res) => {
    const { name, email, password,role } = req.body;
  
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (role !== 'admin' && role !== 'manager' && role !== 'seller') {
      return res.status(400).json({ error: "Invalid role" });
    }
    const validRoles = ['admin', 'manager', 'seller'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = await createAdmin(name, email, passwordHash,role);
      res.status(201).json(newAdmin);
    } catch (err) {
      console.error('signup error', err);
      res.status(500).json({ error: "Signup failed" });
    }
  });

//   admin login routes
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Basic input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // 2. Find admin by email
    const admin = await findAdmiByEmail(email);
    
    if (!admin) {
      // Use constant time response to prevent timing attacks
      await bcrypt.compare('dummy-password', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 4. Set session and respond
    req.session.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
    
    // Explicitly save the session to ensure cookie is sent
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }
      
      console.log(`Login success for: ${email}, Session ID: ${req.sessionID}`);
      
      return res.json({
        message: 'Login successful',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});
router.get('/auth/me', (req, res) => {
  console.log('Auth/me request received, session:', {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    userExists: !!req.session?.user
  });
  
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { role, name, email, id } = req.session.user;
  
  return res.json({ role, name, email, id });
});
  export default router;