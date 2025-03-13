import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from 'src/config/jwt';
import User from 'src/models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded: any = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = { user_id: user._id.toString(), name: user.name, email: user.email }; // Attach user to request
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
