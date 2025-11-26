# Stock Trading Simulator - Backend API

A production-ready, feature-rich backend API for a stock trading simulator built with modern technologies. Includes real-time market data streaming, JWT authentication, Redis caching, MongoDB transactions, and comprehensive API documentation.

## ✨ Features

### Core Functionality
- 📊 **Stock Trading** - Buy/sell stocks with real-time portfolio management
- 💼 **Portfolio Management** - Track holdings, P&L, and transaction history
- 📈 **Market Data** - Real-time stock prices with WebSocket streaming
- 🇮🇳 **Indian Market Indices** - Track NIFTY, SENSEX, BANKNIFTY, and more
- ⭐ **Watchlist** - Save and track your favorite stocks
- 📉 **Market Insights** - Top gainers, losers, most bought stocks, and volume shockers

### Technical Features
- 🔐 **JWT Authentication** - Secure cookie-based authentication
- ⚡ **Redis Caching** - Optimized data retrieval with intelligent caching
- 💾 **MongoDB Transactions** - Atomic operations for order processing
- 🔌 **WebSocket Support** - Real-time price updates via Socket.io
- 📚 **Swagger/OpenAPI** - Interactive API documentation
- 🐳 **Docker Ready** - Complete containerization with auto-seeding
- 🛡️ **Production Ready** - Security middleware, rate limiting, CORS, logging

## 📋 Prerequisites

- **Node.js** 20+ (LTS recommended)
- **MongoDB** 7.0+ (Replica Set not required for development)
- **Redis** 7+
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 20 |
| **Framework** | Express.js |
| **Language** | TypeScript 5.3+ |
| **Database** | MongoDB 7.0 (Mongoose ODM) |
| **Cache** | Redis 7 (ioredis) |
| **Real-time** | Socket.io |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | Zod |
| **Documentation** | Swagger/OpenAPI 3.0 |
| **Security** | Helmet, express-rate-limit, bcrypt |
| **Logging** | Winston |

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (DB, Redis, env validation)
│   ├── controllers/     # HTTP request handlers
│   ├── docs/            # Swagger/OpenAPI documentation
│   ├── middleware/      # Express middleware (auth, validation, error)
│   ├── models/          # MongoDB schemas (User, Stock, Order, Holding, Watchlist)
│   ├── routes/          # API route definitions
│   ├── scripts/         # Utility scripts (database seeding)
│   ├── services/        # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── order.service.ts
│   │   ├── portfolio.service.ts
│   │   ├── stock.service.ts
│   │   ├── socket.service.ts
│   │   └── watchlist.service.ts
│   ├── utils/           # Helper functions (JWT, logger, response)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── docker/              # Docker configuration
│   ├── Dockerfile       # Multi-stage production build
│   ├── docker-compose.yml
│   └── entrypoint.sh    # Container startup script
├── logs/                # Application logs (auto-generated)
├── dist/                # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended)

The easiest way to get started. Everything is containerized and auto-configured.

1. **Navigate to docker directory**
   ```bash
   cd docker
   ```

2. **Start all services**
   ```bash
   docker compose up --build -d
   ```

   This will:
   - Start MongoDB container
   - Start Redis container
   - Build and start the backend API
   - **Automatically seed the database** with sample data

3. **View logs**
   ```bash
   docker compose logs -f backend
   ```

4. **Access the API**
   - API Base: http://localhost:3000
   - API Docs: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

5. **Stop services**
   ```bash
   docker compose down
   ```

### Option 2: Local Development Setup

For active development with hot-reload.

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/stock-trading
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   INITIAL_BALANCE=100000
   CORS_ORIGIN=http://localhost:5173,http://localhost:4173
   ```

3. **Start MongoDB and Redis**
   
   **Using Homebrew (macOS):**
   ```bash
   brew services start mongodb-community
   brew services start redis
   ```
   
   **Using Docker (All platforms):**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   docker run -d -p 6379:6379 --name redis redis:7-alpine
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```
   
   This populates the database with:
   - 5 sample stocks (AAPL, GOOGL, MSFT, AMZN, TSLA)
   - 5 Indian market indices (NIFTY, SENSEX, BANKNIFTY, etc.)

5. **Start development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000` with hot-reload enabled.

## 📚 API Documentation

Interactive Swagger UI available at: **http://localhost:3000/api-docs**

### API Endpoints Overview

All endpoints are prefixed with `/api/v1`

#### 🔐 Authentication
- `POST /auth/register` - Register new user (returns JWT cookie)
- `POST /auth/login` - Login user (returns JWT cookie)
- `GET /auth/me` - Get current user details (requires auth)

#### 📊 Stocks
- `GET /stocks` - Get all stocks (cached 60s)
- `GET /stocks/:symbol` - Get stock details (cached 60s)
- `GET /stocks/:symbol/history` - Get 30-day price history (cached 300s)
- `GET /stocks/most-bought` - Get most frequently purchased stocks (cached 60s)
- `GET /stocks/gainers` - Get top gaining stocks (cached 60s)
- `GET /stocks/losers` - Get top losing stocks (cached 60s)
- `GET /stocks/volume-shockers` - Get stocks with highest volume (cached 60s)

#### 🇮🇳 Indices
- `GET /indices` - Get all Indian market indices (cached 60s)
- `GET /indices/:symbol` - Get index details (NIFTY, SENSEX, etc.) (cached 60s)

#### 💼 Orders
- `POST /orders` - Create buy/sell order (requires auth)
- `GET /orders` - Get user's order history (requires auth)

#### 📈 Portfolio
- `GET /portfolio` - Get user's complete portfolio with P&L (requires auth)

#### ⭐ Watchlist
- `GET /watchlist` - Get user's watchlist (requires auth)
- `POST /watchlist/add` - Add stock to watchlist (requires auth)
- `POST /watchlist/remove` - Remove stock from watchlist (requires auth)

### 📡 Real-time WebSocket API

Connect to Socket.io at `ws://localhost:3000` (no `/api/v1` prefix)

**Client Connection:**
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true
});

// Subscribe to stocks
socket.emit('subscribe', { symbols: ['AAPL', 'GOOGL', 'MSFT'] });

// Listen for initial price history
socket.on('priceHistory', (data) => {
  console.log('Historical data:', data);
  // { symbol: 'AAPL', history: [{ price, timestamp }, ...] }
});

// Listen for live price updates (every 2 seconds)
socket.on('priceUpdate', (data) => {
  console.log('Live update:', data);
  // { symbol: 'AAPL', price: 150.75, changePercent: 0.33, timestamp }
});

// Unsubscribe from stocks
socket.emit('unsubscribe', { symbols: ['GOOGL'] });
```

**WebSocket Events:**

| Event | Direction | Description | Payload |
|-------|-----------|-------------|---------|
| `subscribe` | Client → Server | Subscribe to stock updates | `{ symbols: string[] }` |
| `unsubscribe` | Client → Server | Unsubscribe from stocks | `{ symbols: string[] }` |
| `subscribed` | Server → Client | Subscription confirmation | `{ symbols: string[] }` |
| `priceHistory` | Server → Client | Initial price history (up to 100 points) | `{ symbol, history: [{ price, timestamp }] }` |
| `priceUpdate` | Server → Client | Live price update (every 2s) | `{ symbol, price, changePercent, timestamp }` |
| `unsubscribed` | Server → Client | Unsubscription confirmation | `{ symbols: string[] }` |
| `error` | Server → Client | Error message | `{ message: string }` |

### Authentication

The API uses JWT stored in **HTTP-only cookies** for security. Tokens can also be sent via the `Authorization` header.

**Cookie-based (Recommended):**
```bash
# Register/Login will set the cookie automatically
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Future requests use the cookie
curl http://localhost:3000/api/v1/portfolio -b cookies.txt
```

**Header-based:**
```bash
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing the API

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c /tmp/cookies.txt
```

**2. Get stocks list:**
```bash
curl http://localhost:3000/api/v1/stocks -b /tmp/cookies.txt
```

**3. Create a buy order:**
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{
    "symbol": "AAPL",
    "side": "BUY",
    "quantity": 10
  }'
```

**4. Check portfolio:**
```bash
curl http://localhost:3000/api/v1/portfolio -b /tmp/cookies.txt
```

### Using Postman

1. **Import Swagger to Postman**
   - Open `http://localhost:3000/api-docs`
   - Click "Load" or download `src/docs/swagger.yml`
   - Import into Postman: File → Import → Upload Files

2. **Set up Postman environment**
   - Create environment with variable: `baseUrl` = `http://localhost:3000/api/v1`
   - Cookies will be handled automatically

3. **Test workflow**
   - Register → Login → Get Stocks → Create Order → Check Portfolio

## 💾 Database Seeding

### Development Seeding (TypeScript)
```bash
npm run seed
```

### Production Seeding (Compiled JavaScript)
```bash
npm run seed:prod
```

### Docker Seeding
Seeding happens **automatically** on container startup when `SEED_DATA=true` in `docker-compose.yml`.

**Seed Data Includes:**
- **5 Stocks**: AAPL, GOOGL, MSFT, AMZN, TSLA
- **5 Indices**: NIFTY, SENSEX, BANKNIFTY, MIDCAPNIFTY, FINNIFTY

To disable auto-seeding in Docker, edit `docker/docker-compose.yml`:
```yaml
SEED_DATA: "false"
```

## 🔒 Security Features

- ✅ **Helmet** - Security headers (XSS, clickjacking protection)
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **JWT Authentication** - Secure HTTP-only cookie + header support
- ✅ **Password Hashing** - bcrypt with 10 salt rounds
- ✅ **Input Validation** - Zod schema validation on all inputs
- ✅ **CORS** - Configurable cross-origin requests
- ✅ **Trust Proxy** - Proper IP detection behind proxies

## 📊 Redis Caching Strategy

| Cache Key | Data | TTL |
|-----------|------|-----|
| `stocks:list` | All stocks | 60s |
| `stocks:detail:{symbol}` | Stock details | 60s |
| `stocks:history:{symbol}` | Price history | 300s |
| `stocks:mostBought` | Most bought stocks | 60s |
| `stocks:gainers` | Top gainers | 60s |
| `stocks:losers` | Top losers | 60s |
| `stocks:volumeShockers` | High volume stocks | 60s |
| `indices:list` | All indices | 60s |
| `indices:detail:{symbol}` | Index details | 60s |
| `prices:{symbol}` | Live price history (List) | - |

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with hot reload (nodemon)
npm run build        # Compile TypeScript to JavaScript (dist/)
npm start            # Start production server
npm run seed         # Seed database with sample data (development)
npm run seed:prod    # Seed database using compiled code (production)
npm run lint         # Run ESLint checks
npm run format       # Format code with Prettier
```

## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `MONGO_URI` | MongoDB connection string | - | **Yes** |
| `REDIS_URL` | Redis connection string | - | **Yes** |
| `JWT_SECRET` | JWT signing secret | - | **Yes** |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` | No |
| `INITIAL_BALANCE` | Starting user balance | `100000` | No |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:5173,http://localhost:4173` | No |

### Example `.env` File

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/stock-trading

# Cache
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Application
INITIAL_BALANCE=100000
CORS_ORIGIN=http://localhost:5173,http://localhost:4173,https://groww.shivam09.tech
```

## � Docker Configuration

### Docker Compose Services

```yaml
services:
  mongodb:    # MongoDB 7.0
  redis:      # Redis 7 Alpine
  backend:    # Node.js 20 Alpine (built from Dockerfile)
```

### Docker Commands

```bash
# Start all services (with auto-seed)
docker compose up --build -d

# View logs
docker compose logs -f backend
docker compose logs -f mongodb
docker compose logs -f redis

# Stop services
docker compose down

# Remove volumes (clean slate)
docker compose down -v

# Rebuild after code changes
docker compose up --build
```

### Dockerfile Stages

1. **Builder Stage** - Installs dependencies, copies source, compiles TypeScript
2. **Production Stage** - Lightweight runtime with only production dependencies

## 🐛 Error Handling

All API responses follow a standardized format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "details": { ... }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created (resource created successfully) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (invalid/missing token) |
| `404` | Not Found (resource doesn't exist) |
| `429` | Too Many Requests (rate limit exceeded) |
| `500` | Internal Server Error |

## 📝 Logging

Logs are written to:
- **Console** - Colorized output (development only)
- **`logs/combined.log`** - All logs (info, warn, error)
- **`logs/error.log`** - Error logs only

Log format:
```
2025-11-26 15:30:45 [info]: Server running on port 3000
2025-11-26 15:30:46 [error]: Database connection failed
```

## 🚀 Production Deployment

### Preparation Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use a strong, random `JWT_SECRET` (min 32 characters)
- [ ] Configure **MongoDB Atlas** or managed MongoDB
- [ ] Use **Redis Cloud** or managed Redis service
- [ ] Update `CORS_ORIGIN` with production frontend URL
- [ ] Enable **HTTPS** (required for secure cookies)
- [ ] Set `trust proxy` for proper IP detection
- [ ] Configure proper logging and monitoring
- [ ] Set up health check monitoring
- [ ] Enable automatic backups for MongoDB
- [ ] Configure error tracking (e.g., Sentry)

### Deployment Options

**1. Docker Container (Recommended)**
```bash
docker build -f docker/Dockerfile -t stock-trading-backend .
docker run -p 3000:3000 --env-file .env stock-trading-backend
```

**2. Cloud Platforms**
- **Railway** - Automatic deploys from Git
- **Render** - Built-in Docker support
- **DigitalOcean App Platform** - Managed containers
- **AWS ECS** - Scalable container orchestration
- **Google Cloud Run** - Serverless containers

**3. Traditional VPS**
```bash
npm run build
NODE_ENV=production node dist/server.js
```

Use **PM2** for process management:
```bash
npm install -g pm2
pm2 start dist/server.js --name stock-trading-api
pm2 save
pm2 startup
```

## 🔍 Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T10:00:00.000Z"
}
```

Use this endpoint for:
- Container health checks
- Load balancer health probes
- Uptime monitoring

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🆘 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running:
```bash
brew services start mongodb-community  # macOS
docker run -d -p 27017:27017 mongo:7.0  # Docker
```

**2. Redis Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Ensure Redis is running:
```bash
brew services start redis  # macOS
docker run -d -p 6379:6379 redis:7-alpine  # Docker
```

**3. Port Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change the port in `.env`:
```env
PORT=3001
```

**4. JWT Token Invalid**
```json
{"success":false,"message":"Invalid token"}
```
**Solution:** Ensure you're logged in and the cookie/token is being sent

**5. Docker Container Keeps Restarting**
```bash
docker compose logs backend
```
Check the logs for specific errors (usually MongoDB/Redis connection issues)

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review Swagger API docs

---

**Built with ❤️ using Node.js, Express, TypeScript, MongoDB, Redis, and Socket.io**
