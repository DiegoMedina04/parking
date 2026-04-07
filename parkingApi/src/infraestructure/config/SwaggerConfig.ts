import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking API',
      version: '1.0.0',
      description: 'API para la gestión de parqueaderos y suscripciones',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  // Buscar anotaciones en los controladores y rutas
  apis: ['./src/infraestructure/controllers/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
