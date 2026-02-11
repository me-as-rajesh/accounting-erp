import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

async function register(req, res) {
  const fullName = String(req.body.fullName || '').trim();
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!fullName || !username || !password) {
    return res.status(400).json({ message: 'fullName, username, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, username, passwordHash });

  const token = signToken({ userId: user._id.toString(), username: user.username });
  return res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      activeCompany: user.activeCompany
    }
  });
}

async function login(req, res) {
  const username = String(req.body.username || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const user = await User.findOne({ username });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = signToken({ userId: user._id.toString(), username: user.username });
  return res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      activeCompany: user.activeCompany
    }
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select('username fullName activeCompany');
  return res.json({
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      activeCompany: user.activeCompany
    }
  });
}

export { register, login, me };
