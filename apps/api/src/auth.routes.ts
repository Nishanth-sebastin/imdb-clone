import express from 'express';
import User from './models/user.model';
import RefreshToken from './models/refreshtoken.model';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './config/jwt';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log(req.body);
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, username, email, password });
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Store refresh token in DB
  await RefreshToken.create({ userId: user._id, token: refreshToken });

  // Store refreshToken securely in an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.json({ accessToken });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  // Check if the token exists in the DB before proceeding
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newAccessToken = generateAccessToken(user._id.toString());
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  await RefreshToken.deleteOne({ token: req.cookies.refreshToken });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
