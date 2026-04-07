import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './infraestructure/config/DatabaseConfig';

const PORT = process.env.PORT || 8080;

AppDataSource.initialize()
  .then(() => {
    console.log('[database]: Database connection established');
    

    app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('[database]: Error connecting to database:', error);
  });
