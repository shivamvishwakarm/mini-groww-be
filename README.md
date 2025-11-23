# Stock Trading Simulator - Backend

A production-ready backend API for a stock trading simulator built with Node.js, Express, TypeScript, MongoDB, and Redis.

## 🚀 Features

- **RESTful API** with comprehensive endpoints for trading operations
- **JWT Authentication** for secure user sessions
- **Redis Caching** for optimized stock data retrieval
- **MongoDB** for persistent data storage
- **TypeScript** for type safety and better developer experience
- **Swagger/OpenAPI** documentation with interactive UI
- **Docker** support for easy deployment
- **Production-ready** with security middleware, rate limiting, and error handling

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB 7.0+
- Redis 7+
- Docker & Docker Compose (optional, for containerized deployment)

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Cache**: Redis (with ioredis)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, express-rate-limit, bcrypt
- **Logging**: Winston

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Redis, env)
│   ├── controllers/     # HTTP request handlers
│   ├── docs/            # Swagger/OpenAPI documentation
│   ├── middleware/      # Express middleware (auth, validation, error)
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── scripts/         # Utility scripts (seed data)
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions (JWT, logger, response)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── docker/              # Docker configuration
├── logs/                # Application logs
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd /Users/shivam/assignment/fintech-clone/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/stock-trading
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   INITIAL_BALANCE=100000
   ```

4. **Start MongoDB and Redis**
   
   Make sure MongoDB and Redis are running locally:
   ```bash
   # MongoDB (if installed via Homebrew on macOS)
   brew services start mongodb-community
   
   # Redis (if installed via Homebrew on macOS)
   brew services start redis
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

### Docker Setup

1. **Navigate to docker directory**
   ```bash
   cd docker
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Seed the database** (from host machine)
   ```bash
   cd ..
   npm run seed
   ```

4. **View logs**
   ```bash
   docker-compose logs -f backend
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## 📚 API Documentation

Once the server is running, access the interactive Swagger UI at:

**http://localhost:3000/api-docs**

### API Endpoints

All API endpoints are prefixed with `/api/v1`

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (requires auth)

#### Stocks
- `GET /stocks` - Get all stocks (cached 60s)
- `GET /stocks/:symbol` - Get stock details (cached 60s)
- `GET /stocks/:symbol/history` - Get price history (cached 300s)

#### Orders
- `POST /orders` - Create buy/sell order
- `GET /orders` - Get user's order history

#### Portfolio
- `GET /portfolio` - Get user's portfolio with P&L

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing with Postman

1. **Export Swagger to Postman**
   - Open Swagger UI at `http://localhost:3000/api-docs`
   - Download the `swagger.yml` file from `/src/docs/swagger.yml`
   - Import into Postman: File → Import → Upload Files

2. **Set up Postman environment**
   - Create a new environment
   - Add variable: `baseUrl` = `http://localhost:3000/api/v1`
   - Add variable: `token` (will be set after login)

3. **Test workflow**
   - Register a new user → Save the token
   - Login → Update `token` variable
   - Get stocks list
   - Create a BUY order
   - Check portfolio
   - Create a SELL order

## 💾 Database Seeding

The seed script populates the database with 30 sample stocks across various sectors:

```bash
npm run seed
```

This will:
- Clear existing stock data
- Insert 30 stocks (AAPL, GOOGL, MSFT, etc.)
- Set realistic prices and market caps

## 🔒 Security Features

- **Helmet** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Zod schema validation
- **CORS** - Configurable cross-origin requests

## 📊 Redis Caching

Cache strategy for optimal performance:

| Data Type | Cache Key | TTL |
|-----------|-----------|-----|
| Stocks List | `stocks:list` | 60s |
| Stock Detail | `stocks:detail:{symbol}` | 60s |
| Price History | `stocks:history:{symbol}` | 300s |

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Start production server
npm run seed       # Seed database with stock data
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGO_URI` | MongoDB connection string | Required |
| `REDIS_URL` | Redis connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `INITIAL_BALANCE` | Starting user balance | 100000 |

## 🐛 Error Handling

All errors return a standardized format:

```json
{
  "success": false,
  "message": "Error description",
  "details": {}
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Logging

Logs are written to:
- Console (colorized, development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas for database
4. Use Redis Cloud or managed Redis
5. Set up proper CORS origins
6. Enable HTTPS
7. Configure proper logging
8. Set up monitoring and alerts

## 📄 License

MIT

## 🤝 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using Node.js, Express, TypeScript, MongoDB, and Redis**
