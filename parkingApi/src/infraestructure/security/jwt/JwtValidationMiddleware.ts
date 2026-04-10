import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenJwtConfig } from '../../config/TokenJwtConfig';

export const jwtValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.header(TokenJwtConfig.HEADER_AUTHORIZATION);

  if (!header || !header.startsWith(TokenJwtConfig.PREFIX_TOKEN)) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
    return;
  }

  const token = header.replace(TokenJwtConfig.PREFIX_TOKEN, '');

  try {
    const payload = jwt.verify(token, TokenJwtConfig.SECRET_KEY);
    
    (req as any).user = payload;
    next();
  } catch (error) {
    console.log({error});
    
    res.status(403).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'el token no es valido!',
    });
  }
};
