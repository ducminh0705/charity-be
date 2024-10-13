import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const user = await User.findByPk(payload.userId);

    if (!user) {
      res.sendStatus(401);
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
};
