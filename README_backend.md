# Parking API - Documentación del Backend

Este documento detalla la estructura, tecnologías y arquitectura del backend de **Parking API**, desarrollado en Node.js utilizando **TypeScript**, **Express**, **TypeORM** y adherido a los principios de la **Arquitectura Hexagonal**.

## Arquitectura (Hexagonal / Puertos y Adaptadores)

A continuación, un mapa visual exacto de cómo están ordenadas las carpetas centralizadas en `src/`:

```text
parkingApi/
└── src/
    ├── application/          # Capa de Aplicación
    │   ├── services/         # (Fachadas/Servicios aglutinadores: AuthService, UserService...)
    │   └── usecases/         # (Casos de uso y reglas de negocio: LoginUseCaseImpl...)
    ├── domain/               # Capa de Dominio Pura (El "Core")
    │   ├── exceptions/       # (Manejo de errores amigable)
    │   ├── models/           # (Entidades base de TypeScript: User, Vehicle...)
    │   └── ports/            # (Contratos de inversión de dependencias)
    │       ├── in/           # Interfaces de Entrada (Cómo usar el dominio)
    │       └── out/          # Interfaces de Salida (Cómo el dominio saca/guarda información)
    ├── infraestructure/      # Capa de Desarrollo Exterior (Adaptadores)
    │   ├── config/           # (Inyección de Dependencias, Conexión BD)
    │   ├── controllers/      # (Controladores HTTP Express)
    │   ├── entities/         # (Esquemas TypeORM)
    │   ├── middleware/       # (Middlewares de logging/validación abstracta)
    │   ├── repositories/     # (Implementaciones físicas MySQL TypeORM)
    │   ├── routes/           # (Definición de rutas atadas a controladores)
    │   └── security/         # (Bcrypt, JWT y filtros de seguridad)
    └── routes/               # Carpeta Principal de Enrutamiento
        └── index.ts          # Centralizador Expuesto (Endpoints base)
```

El sistema ha sido rigurosamente construido con Arquitectura Hexagonal para asegurar que la lógica principal de negocio (el *Core*) esté totalmente aislada e independiente de tecnologías externas (como bases de datos MySQL, servidores web Express o librerías de terceros).

El flujo de dependencia de las capas siempre va de **afuera hacia adentro**.

La estructura está dividida principalmente dentro de `src/` en las siguientes capas:

### 1. Capa de Dominio (`src/domain`)
Es el corazón de la aplicación. Contiene únicamente las reglas de negocio, modelos y contratos genéricos. No sabe absolutamente nada sobre `Express` ni `TypeORM` ni la base de datos local.

- **`models/`**: Clases en TypeScript puras que representan las abstracciones del negocio (`User`, `Role`, `Client`, `Vehicle`, `VehicleType`, `Ticket`, `Parking`, `Plan`, `Subscription`, `TicketPayment`, `Mensualidad`, `PlanMensualidad`).
- **`exceptions/`**: Excepciones de negocio personalizadas como `NotFoundError` o `BusinessLogicError` para manejo predecible de errores sin depender del protocolo HTTP.
- **`ports/in/` (Puertos de Entrada)**: Son las interfaces de los Casos de Uso que la aplicación expone hacia el exterior (ej. `CreateUserUseCase`, `RetrieveVehicleUseCase`).
- **`ports/out/` (Puertos de Salida)**: Son las interfaces que debe cumplir cualquier sistema de persistencia o librería que el dominio necesite para guardar/leer datos (ej. `UserRepositoryPort`, `JwtGeneratorPort`, `PasswordHasherPort`). El dominio dicta las reglas abstractas de los métodos que necesita.

### 2. Capa de Aplicación (`src/application`)
Implementa las funcionalidades del software usando las interfaces dictadas por el dominio. Tampoco conoce infraestructura, solo orquesta flujos.

- **`usecases/`**: Implementaciones reales de los puertos de entrada (`CreateUserUseCaseImpl`, `LoginUseCaseImpl`, `UpdateTicketUseCaseImpl`, etc.). Valida reglas de negocio estrictas antes de llamar al repositorio exterior. (ej: *Verificar que un tipo de vehículo exista antes de crear un vehículo*).
- **`services/`**: Agrupadores (Facades) que consolidan múltiples casos de uso de un módulo en particular (`AuthService`, `TicketService`, `UserService`). Su objetivo es proveer una sola puerta de entrada manejable para los controladores de infraestructura.

### 3. Capa de Infraestructura (`src/infraestructure`)
Conecta la aplicación pura con el mundo exterior. Actúa como los adaptadores de los puertos definidos en el dominio.

- **`controllers/`**: Manejador de las peticiones REST de `Express` (`AuthController`, `VehicleController`, etc.). Aquí se reciben Requests HTTP, se extrae el body/query y se delega toda responsabilidad en los `Services`. Luego envía respuestas JSON con códigos HTTP adecuados.
- **`entities/`**: Modelos de base de datos ORM de `TypeORM` (como `UserEntity.ts`). Contienen decoradores de base de datos y métodos mapeadores `.toDomainModel()` y `.fromDomainModel()` para aislar TypeORM estrictamente en esta capa.
- **`repositories/`**: Implementación física de los puertos de salida. Todos los `TypeOrm___RepositoryAdapter` consumen a las entidades de TypeORM para ejecutar persistencia a MySQL y devuelven modelos de dominio limpios y desligados de TypeORM.
- **`security/`**: Herramientas integradas para autenticación y encriptado que adoptan los puertos del dominio.
  - `BcryptPasswordHasherAdapter`: Implementación sobre la popular librería `bcrypt`.
  - `jwt/JwtGeneratorAdapter`: Implementación sobre `jsonwebtoken` encargada de fabricar los JWT para la autorización.
  - `jwt/JwtValidationMiddleware`: Middleware global de Express para validar JWT en los *headers* de las peticiones y rechazar no autorizados (`401`).
- **`config/DependencyInjection.ts`**: El enrutador vital de la arquitectura. Dado que la inyección de dependencias estricta se usa en todo el proyecto, **aquí se instancia todo manualmente**. Se instancian repositorios, luego casos de usos, luego servicios y se entregan a los Controladores (ej. `getAuthController()`). Promueve código fácil de *mockear* o ser reemplazado.

### 4. Capa de Enrutamiento Web (`src/routes`)
Construída utilizando `Express.Router()`. Mapea endpoints (rutas URIs) directamente a métodos de la capa `controllers/`. Se encargan de:
- Inicializar la inyección de dependencias (`DependencyInjection.get___Controller()`).
- Definir la seguridad. En el archivo `index.ts`, todas las rutas base son declaradas. Todas atraviesan la validación JWT global obligatoria excepto algunas públicas (como `/auth/login` o `/health`). 

## Características Resaltantes e Implementadas

- **Gestión de Autenticación**: El controlador de Login abstrae la comparación de passwords a través de puertos. Implementa validaciones *tokenized* (JWT) y el registro usa hashing de contraseñas de forma transparente.
- **Excepciones Limpias**: Si explota un error en un caso de uso (ej. `NotFoundError`), simplemente sube hasta el bloque `catch` del controller y se envía una respuesta predecible con estatus `500` o estatus custom.
- **Acoplamiento Nulo de Persistencia**: Si mañana se deciden reemplazar MySQL y TypeORM por MongoDB o Prisma ORM, basta con desarrollar nuevos archivos `Mongo___RepositoryAdapter.ts` dentro de infraestructura. Absolutamente nada de lo que está en `application/` y `domain/` tendrá que ser modificado.

---
**Consideraciones para el Frontend (ParkingWeb)**
Al consumir esta API: 
1. **Autenticarse primero**: Pegar a `POST /api/auth/login` con el `email` y `password` correctos.
2. Recuperar el Token del objeto retornado y el perfil general del usuario autenticado.
3. Almacenarlo adecuadamente en el Storage (Zustand, LocalStorage, SecureCookies).
4. Todas las futuras comunicaciones (`GET /user`, `POST /vehicle`, etc.) deben enviar un header HTTP:
   - `Authorization: Bearer <TU_TOKEN>`
