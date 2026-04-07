import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService'; // Assuming it will exist
import { User } from '../../domain/models/User';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               document:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  async findAll(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getUsers();
    res.status(200).json(users);
  }

  async save(req: Request, res: Response): Promise<void> {
    const user: User = req.body;
    const savedUser = await this.userService.save(user);
    res.status(201).json(savedUser);
  }
}
