import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../config/jwt';
import User from '../models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  // No token - proceed without authentication
  if (!token) return next();

  try {
    // Verify token (throws error if invalid/expired)
    const decoded: any = verifyAccessToken(token);

    // Check user exists
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(403).json({ message: 'User not found' });
    // Attach valid user
    req.user = {
      user_id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(403).json({
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        });
      }

      // Handle other errors
      return res.status(500).json({ message: error.message });
    }

    // Other errors
    console.error('❌ Authentication error:', error);
    return res.status(403).json({ message: 'Authentication failed' });
  }
};

export default optionalAuthMiddleware;
