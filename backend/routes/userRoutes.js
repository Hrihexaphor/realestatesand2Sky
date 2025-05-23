import express from 'express';
import { createUser, getAllUsers, deleteUserById, updateUserById } from '../services/adminServices.js';
import { ROLES_ARRAY } from '../constants/roles.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.post('/signup', async (req, res) => {
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!ROLES_ARRAY.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: "Permissions must be an array" });
    }

    if (role === 'admin' && permissions.length > 0) {
        return res.status(400).json({ error: "Admin role should not have permissions" });
    }

    try {
        const newUser = await createUser({ name, email, password, role, permissions });
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role, permissions } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    console.log('Received data for update:', { name, email, password, role, permissions });

    if (!ROLES_ARRAY.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!Array.isArray(permissions)) {
        return res.status(400).json({ error: "Permissions must be an array" });
    }

    if (role === 'admin' && permissions.length > 0) {
        return res.status(400).json({ error: "Admin role should not have permissions" });
    }

    const cleanPassword = password ? password.trim() : null;

    try {
        const updatedUser = await updateUserById(id, { name, email, password: cleanPassword, role, permissions });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteUserById(req.params.id);
    if (deleted) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default userRouter;