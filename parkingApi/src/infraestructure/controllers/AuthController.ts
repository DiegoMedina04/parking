import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ status: 'error', message: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(email, password);

      if (!result) {
        res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        return;
      }

      res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const user = req.body;
      const savedUser = await this.authService.signup(user);
      
      // Eliminar password del response
      const { password, ...safeUser } = savedUser as any;
      
      res.status(201).json({ status: 'success', data: safeUser });
    } catch (error: any) {
      const statusCode = error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({ status: 'error', message: error.message });
    }
  }
}
