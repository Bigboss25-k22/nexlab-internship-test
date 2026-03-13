import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { JwtPayload } from '../types/auth';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);

    if (!token || token.split('.').length !== 3) {
      throw new UnauthorizedError('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
      next(new UnauthorizedError('Malformed token'));
    } else if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      console.error('Unexpected auth error:', error);
      next(new UnauthorizedError('Authentication failed'));
    }
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to access this resource');
    }

    next();
  };
};
