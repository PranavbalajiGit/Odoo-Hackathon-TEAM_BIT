# Inventory Management Backend

A Node.js backend for inventory management using Express and Sequelize.

## Features

- User authentication with JWT
- Warehouse, location, and product management
- Stock tracking with reservations
- Operations: Receipts, Deliveries, Adjustments
- Move history
- Soft deletes and auditing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials.

3. Create database and run migrations:
   ```bash
   npm run db:migrate
   ```

4. Seed sample data:
   ```bash
   npm run db:seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. View API documentation at `http://localhost:3000/api-docs`

   **Note:** For protected endpoints, click "Authorize" in Swagger UI and enter `Bearer <token>` (replace <token> with the JWT from login).

## Scripts

- `npm run dev`: Start with nodemon
- `npm run start`: Start production
- `npm run db:migrate`: Run migrations
- `npm run db:seed`: Run seeders
- `npm run db:undo`: Undo last migration
- `npm run lint`: Lint code

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login

### Warehouses
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses/:id` - Get warehouse
- `PATCH /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

### Locations
- `GET /api/warehouses/:warehouseId/locations` - List locations
- `POST /api/warehouses/:warehouseId/locations` - Create location
- `PATCH /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock
- `GET /api/stock` - Get stock levels
- `PATCH /api/stock/adjust` - Adjust stock

### Operations
- `GET /api/operations` - List operations
- `POST /api/operations` - Create operation
- `GET /api/operations/:id` - Get operation
- `PATCH /api/operations/:id` - Update operation
- `POST /api/operations/:id/confirm` - Confirm operation
- `POST /api/operations/:id/validate` - Validate operation
- `POST /api/operations/:id/cancel` - Cancel operation

### Moves
- `GET /api/moves` - List move history

## Example Curl Commands

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"loginId": "test01", "email": "test@example.com", "password": "Password123!"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginIdOrEmail": "test01", "password": "Password123!"}'
```

Use the returned token in Authorization header: `Authorization: Bearer <token>`

### Create Warehouse
```bash
curl -X POST http://localhost:3000/api/warehouses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Warehouse", "shortCode": "TW"}'
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "sku": "TP001", "unitCost": 100.00}'
```

### Create Receipt Operation
```bash
curl -X POST http://localhost:3000/api/operations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouseId": 1,
    "type": "RECEIPT",
    "toLocationId": 1,
    "scheduledAt": "2023-11-22T10:00:00Z",
    "lines": [{"productId": 1, "quantity": 10}]
  }'
```

Then confirm and validate:
```bash
curl -X POST http://localhost:3000/api/operations/1/confirm \
  -H "Authorization: Bearer <token>"

curl -X POST http://localhost:3000/api/operations/1/validate \
  -H "Authorization: Bearer <token>"
```