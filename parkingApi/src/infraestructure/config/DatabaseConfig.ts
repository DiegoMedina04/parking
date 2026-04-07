import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Entities
import { UserEntity } from '../entities/UserEntity';
import { ParkingEntity } from '../entities/ParkingEntity';
import { PlanEntity } from '../entities/PlanEntity';
import { RoleEntity } from '../entities/RoleEntity';
import { SubscriptionEntity } from '../entities/SubscriptionEntity';
import { ClientEntity } from '../entities/ClientEntity';
import { VehicleEntity } from '../entities/VehicleEntity';
import { VehicleTypeEntity } from '../entities/VehicleTypeEntity';
import { TicketEntity } from '../entities/TicketEntity';
import { TicketPaymentEntity } from '../entities/TicketPaymentEntity';
import { PlanMensualidadEntity } from '../entities/PlanMensualidadEntity';
import { MensualidadEntity } from '../entities/MensualidadEntity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'parking',
  synchronize: true, // Auto create tables - only for development
  logging: false,
  entities: [
    UserEntity,
    RoleEntity,
    ParkingEntity,
    PlanEntity,
    SubscriptionEntity,
    ClientEntity,
    VehicleEntity,
    VehicleTypeEntity,
    TicketEntity,
    TicketPaymentEntity,
    PlanMensualidadEntity,
    MensualidadEntity
  ],
  subscribers: [],
  migrations: [],
});
