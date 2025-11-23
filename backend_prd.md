
# Backend PRD – Stock Trading Simulator (Groww-like)

## ✅ 1. Overview
This backend provides secure, production-style REST APIs for a **stock trading simulator**. It will serve the React frontend, support mock trading logic, store data in MongoDB, cache frequently accessed data in Redis, and expose a full Swagger/OpenAPI specification (`swagger.yml`) that can be imported into Postman.

This backend should be:
- Modular
- Scalable
- Typed (TypeScript)
- Documented
- Docker-ready
- Secure (JWT auth, validation, error handling)

---

## ✅ 2. Tech Stack Requirements

### Core
- **Node.js** (LTS)
- **Express.js**
- **TypeScript**

### Database
- **MongoDB** (MongoDB Atlas recommended)

### Caching
- **Redis** (for stock list + stock detail + price history caching)

### Auth
- **JWT-based auth**
- Password hashing via **bcrypt**

### Documentation
- **Swagger/OpenAPI 3.0**
  - `swagger.yml` MUST be generated and exportable to Postman

### Containerization
- **Docker + Docker Compose**
  - Containers:
    - backend
    - mongo
    - redis

### Tooling
- ESLint + Prettier
- Winston or Pino logging
- Jest (Optional for unit tests)

---

## ✅ 3. Architecture & Folder Structure

```
backend/
  src/
    config/
      db.ts
      redis.ts
      env.ts
    server.ts
    app.ts
    routes/
      auth.routes.ts
      stocks.routes.ts
      orders.routes.ts
      portfolio.routes.ts
    controllers/
      auth.controller.ts
      stocks.controller.ts
      orders.controller.ts
      portfolio.controller.ts
    services/
      auth.service.ts
      stocks.service.ts
      orders.service.ts
      portfolio.service.ts
    models/
      User.model.ts
      Stock.model.ts
      Order.model.ts
      Holding.model.ts
    middleware/
      auth.middleware.ts
      validate.middleware.ts
      error.middleware.ts
    utils/
      jwt.ts
      response.ts
      logger.ts
    docs/
      swagger.yml
  docker/
    Dockerfile
    docker-compose.yml
  package.json
  tsconfig.json
  README.md
```

### Design Principles
- **Controllers** → HTTP logic only
- **Services** → Business logic
- **Models** → Database schemas
- **Routes** → API endpoints + middleware
- **Redis Cache Layer** → in `stocks.service.ts`

---

## ✅ 4. Data Models (MongoDB)

### 🧑 User
```
id (string, ObjectId)
name (string)
email (string, unique)
passwordHash (string)
createdAt (date)
updatedAt (date)
```

### 📈 Stock
```
id (string, ObjectId)
symbol (string, unique)
name (string)
sector (string)
currentPrice (number)
previousClose (number)
marketCap (number)
```

### 👜 Holding
```
id (string, ObjectId)
userId (ObjectId)
symbol (string)
quantity (number)
avgBuyPrice (number)
```

### 📜 Order
```
id (string, ObjectId)
userId (ObjectId)
symbol (string)
side ("BUY" | "SELL")
quantity (number)
price (number)
createdAt (date)
```

---

## ✅ 5. API Endpoints (REST)

All routes prefixed with `/api/v1`

### ✅ Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Create account |
| POST | `/auth/login` | ❌ | Login and return JWT |
| GET | `/auth/me` | ✅ | Get current user |

### ✅ Stocks
| Method | Endpoint | Auth | Cache | Description |
|--------|----------|------|-------|-------------|
| GET | `/stocks` | ✅ | ✅ Redis | List all stocks |
| GET | `/stocks/:symbol` | ✅ | ✅ Redis | Get stock details |
| GET | `/stocks/:symbol/history` | ✅ | ✅ Redis | Get price history |

### ✅ Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | ✅ | Create order (BUY/SELL) |
| GET | `/orders` | ✅ | List all orders |

### ✅ Portfolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/portfolio` | ✅ | User holdings + summary |

---

## ✅ 6. Redis Caching Rules

| Data | Key Pattern | TTL |
|------|-------------|-----|
| Stocks List | `stocks:list` | 60s |
| Stock Detail | `stocks:detail:${symbol}` | 60s |
| Price History | `stocks:history:${symbol}` | 300s |

Cache invalidation only needed if mock data changes.

---

## ✅ 7. Swagger/OpenAPI Requirements

- Use **Swagger 3.0**
- Output **swagger.yml** under `/src/docs`
- Define:
  ✅ Schemas (User, Stock, Order, Holding, ErrorResponse)  
  ✅ Tags (Auth, Stocks, Orders, Portfolio)  
  ✅ Security scheme (Bearer JWT)  
  ✅ Request/response bodies  
  ✅ Status codes  

Swagger must support:
- Try It Out
- Import to Postman

Endpoint docs must include:
- Description
- Parameters
- Request body
- Responses
- Examples

---

## ✅ 8. Production Features

### ✅ Security
- Helmet middleware
- Rate limiter (e.g., 100 req/15 min)
- Input validation via Zod/Joi/Yup

### ✅ Error Handling
Centralized handler returning:
```
{
  success: false,
  message: string,
  details?: any
}
```

### ✅ Logging
Use Winston/Pino:
- Info logs
- Error logs
- Request logging (method, url, status, duration)

### ✅ Env Configuration
Use `.env`:
```
PORT=
MONGO_URI=
JWT_SECRET=
REDIS_URL=
```

Never commit `.env`.

---

## ✅ 9. Docker Setup

### docker-compose.yml must start:
- backend service
- mongodb service
- redis service

Backend Dockerfile should:
- Use Node Alpine base
- Install dependencies
- Run build
- Run `node dist/server.js`

---

## ✅ 10. Testing & Postman

- Swagger-generated `swagger.yml` must be importable into Postman
- All endpoints should be testable manually
- Optional: Seed script for stocks data

---

## ✅ 11. Deliverables

✅ Fully working backend  
✅ Swagger UI served at `/api-docs`  
✅ `swagger.yml` exportable for Postman  
✅ Redis caching  
✅ Docker + Docker Compose  
✅ Clean folder structure  
✅ Well-commented code  
✅ README with setup steps  

---

## ✅ 12. Future Enhancements (Optional)

- WebSockets for live price updates
- Role-based access control
- Notifications
- Pagination + filtering
