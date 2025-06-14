import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized access.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next(); // proceed to next route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token expired or invalid.' });
  }
};
