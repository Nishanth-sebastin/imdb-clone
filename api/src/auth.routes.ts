import express, { Request, Response } from 'express';
import User from './models/user.model.js';
import RefreshToken from './models/refreshtoken.model.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './config/jwt.js';
import { validateRequest } from './middlewares/validateRequest.js';
import { registerSchema, loginSchema } from './validations/userValidation.js';
const router = express.Router();

router.post('/register', validateRequest(registerSchema), async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  await User.create({ name, username, email, password });
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());

  // Store refresh token in DB
  await RefreshToken.create({ userId: user.id, token: refreshToken });

  // Store refreshToken securely in an HTTP-only cookie
  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: false, // false in development
  //   sameSite: 'lax',
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  // Check if the token exists in the DB before proceeding
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newAccessToken = generateAccessToken(user.id.toString());
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  await RefreshToken.deleteOne({ token: req.cookies.refreshToken });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
