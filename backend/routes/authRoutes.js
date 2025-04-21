import express from 'express';
import bcrypt from 'bcrypt';
import { findAdmiByEmail,createAdmin } from '../services/adminServices.js';    

const router = express.Router();
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newAdmin = await createAdmin(name, email, passwordHash);
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
      console.log(`Login failed: No admin found for email ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Set session and respond
    req.session.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    console.log(`Login success: ${email}`);
    res.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});
  export default router;