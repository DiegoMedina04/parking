import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infraestructure/config/SwaggerConfig';
import { globalExceptionHandler } from './infraestructure/middleware/GlobalExceptionHandler';

const app: Application = express();

// Middlewares

// app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://parking.diegomedinadev.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Parking API is running...');
});

// Global Error Handler
app.use(globalExceptionHandler);

export default app;
