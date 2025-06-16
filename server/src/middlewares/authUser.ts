import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['x-auth-token'];

  if (!token || Array.isArray(token)) {
    res.status(401).json({ message: 'Unauthorized access.' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'object' && decoded !== null && 'user' in decoded) {
      req.user = decoded.user;
      next(); // proceed to next route handler
    } else {
      res.status(401).json({ message: 'Invalid token payload.' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token expired or invalid.' });
  }
};
