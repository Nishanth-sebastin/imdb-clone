import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from 'src/config/jwt';
import User from 'src/models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (token) {
      const decoded: any = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);

      if (user) {
        req.user = { user_id: user._id.toString(), name: user.name, email: user.email }; // Attach user to request
      }
    }
  } catch (error) {
    console.error('❌ Authentication error:', error);
  }

  next();
};

export default optionalAuthMiddleware;
