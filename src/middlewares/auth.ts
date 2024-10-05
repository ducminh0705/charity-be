import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const user = await User.findByPk(payload.userId);
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
