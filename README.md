# Nexlab API

A robust Node.js REST API built with TypeScript, Express, and TypeORM for the Nexlab platform - connecting freelancers with store owners.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Secure HttpOnly cookies for refresh tokens
  - Role-based access control (Owner, Freelancer)
  - Token blacklisting for secure logout

- **User Management**
  - User registration with role selection
  - Profile management for freelancers and store owners
  - Email and phone validation

- **Security**
  - Password hashing with bcrypt
  - CORS protection
  - Input validation with Joi
  - Error handling middleware
  - Malformed token protection

- **Database**
  - PostgreSQL with TypeORM
  - Database migrations
  - Entity relationships

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: bcrypt, CORS
- **Development**: ts-node-dev, ESLint, Prettier

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nexlab-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password_here
   DB_DATABASE=nexlab_db

   # JWT Secrets (Generate strong secrets for production)
   JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Database setup**

   ```bash
   # Create database
   createdb nexlab_db

   # Run migrations
   npm run migration:run
   ```

## 🚀 Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securePassword123",
  "role": "freelancer",
  "birthDate": "1990-01-01",
  "gender": "male"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "emailOrPhone": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

_Note: Refresh token is set as HttpOnly cookie_

#### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

_Note: Can also use cookie automatically_

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### User Endpoints

#### Get Profile

```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

## 🗄️ Database Schema

### Core Entities

- **Users**: Main user table with authentication info
- **StoreOwners**: Extended profile for store owners
- **Freelancers**: Extended profile for freelancers with location data
- **RefreshTokens**: Secure refresh token storage
- **Stores**: Store information
- **JobApplications**: Job application tracking
- **Contracts**: Contract management

### Entity Relationships

```
User (1:1) StoreOwner
User (1:1) Freelancer
User (1:N) RefreshTokens
StoreOwner (1:N) Stores
```

## 🔒 Security Features

### JWT Implementation

- **Access Token**: Short-lived (15 minutes), contains user ID and role
- **Refresh Token**: Long-lived (7 days), stored in database with revocation support
- **HttpOnly Cookies**: Refresh tokens stored securely, inaccessible to JavaScript

### Token Security

- Malformed token detection
- Automatic token cleanup on logout
- Role-based route protection

### Password Security

- bcrypt hashing with salt rounds
- Password strength validation

## 🧪 Testing

### Using Postman

1. **Import Collection**: Use the provided `Nexlab-API.postman_collection.json`

2. **Test Flow**:
   - Register a new user
   - Login to get tokens
   - Test protected routes with access token
   - Test refresh token functionality
   - Test logout and token invalidation

### Manual Testing

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","phone":"1234567890","password":"password123","role":"freelancer"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"password123"}'
```

## 📝 Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build           # Compile TypeScript to JavaScript
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting

# Database
npm run migration:generate  # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   └── data-source.ts
├── controllers/      # Route controllers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── entities/         # TypeORM entities
│   ├── User.ts
│   ├── StoreOwner.ts
│   ├── Freelancer.ts
│   └── ...
├── middlewares/      # Express middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── migrations/       # Database migrations
├── routes/          # API routes
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── index.ts
├── services/        # Business logic
│   ├── auth.service.ts
│   └── user.service.ts
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   ├── errors.ts
│   ├── jwt.ts
│   └── async-handler.ts
├── validations/     # Input validation schemas
└── index.ts         # Application entry point
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use async/await for asynchronous operations
- Implement proper error handling

### Database

- Always create migrations for schema changes
- Use TypeORM decorators for entity definitions
- Implement proper relationships between entities

### Security

- Never expose sensitive data in responses
- Validate all inputs
- Use environment variables for secrets
- Implement proper authentication checks

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set:

- Database connection details
- JWT secrets (use strong, unique secrets)
- CORS origins for your frontend
- Set `NODE_ENV=production`

### Database

```bash
# Run migrations in production
npm run migration:run
```

### Process Management

Consider using PM2 for production:

```bash
npm install -g pm2
pm2 start dist/index.js --name "nexlab-api"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

**Happy Coding! 🚀**
