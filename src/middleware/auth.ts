import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  isConfirmed: boolean;
}

const isVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }

    const user = jwt.verify(token, process.env.jwtSecret || 'secret') as JwtPayload;

    if (!user.isConfirmed) {
      return res.status(401).json({ message: 'Please confirm your email address' });
    }

    // Attach user information to request object
    (req as any).user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default isVerified;
