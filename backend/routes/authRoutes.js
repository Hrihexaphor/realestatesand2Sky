import express from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '../services/adminServices.js';

const router = express.Router();

//   admin login routes
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation (your existing code)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find admin by email (your existing code)
    const admin = await findUserByEmail(email);

    if (!admin) {
      // Your existing code for invalid user
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords (your existing code)
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session data
    req.session.user = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    };

    // THIS IS IMPORTANT: Explicitly save the session
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to create session' });
      }

      // Log session data for debugging
      console.log('Login successful, session data:', {
        sessionID: req.sessionID,
        user: req.session.user
      });

      // Return success response
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
  console.log('Auth/me request received, session data:', {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    user: req.session?.user || null
  });

  // This checks for req.session.user as you're storing in your login route
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Return the user data from the session
  const userData = req.session.user;
  return res.json(userData);
});

export default router;