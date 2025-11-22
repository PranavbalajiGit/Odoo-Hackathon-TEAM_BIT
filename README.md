# Inventory Management System - Project Explanation

## 📋 Project Overview

This is a **full-stack Inventory Management System** built for the Odoo Hackathon by TEAM_BIT. The system provides comprehensive inventory tracking, warehouse management, and stock operation capabilities for businesses to manage their inventory efficiently.

## 🎯 Project Purpose

The system enables businesses to:
- **Track Products**: Manage product catalog with SKUs, costs, and units of measure
- **Manage Warehouses**: Organize inventory across multiple warehouses and locations
- **Handle Operations**: Process receipts, deliveries, transfers, and stock adjustments
- **Monitor Stock**: Real-time stock levels with location-based tracking
- **Track History**: Complete audit trail of all stock movements

## 🏗️ Architecture

### **Technology Stack**

#### Frontend (Client)
- **Framework**: React 18.3.1
- **Build Tool**: Create React App with CRACO
- **Routing**: React Router DOM v7
- **State Management**: React Context API (AuthContext, InventoryContext)
- **HTTP Client**: Axios
- **UI Components**: 
  - Radix UI (Accessible component primitives)
  - Tailwind CSS (Utility-first styling)
  - Lucide React (Icons)
- **Notifications**: Sonner (Toast notifications)
- **Form Validation**: React Hook Form + Zod

#### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **ORM**: Sequelize 6.35.0
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Validation**: Zod 3.22.4
- **API Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS
- **Development**: Nodemon

## 📁 Project Structure

```
Odoo-Hackathon-TEAM_BIT/
├── client/                    # React Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Topbar.js
│   │   │   └── ui/            # Radix UI components
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.js    # Authentication state
│   │   │   └── InventoryContext.js # Inventory state
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Login, Signup, Reset Password
│   │   │   ├── products/      # Product management
│   │   │   ├── operations/    # Receipts, Deliveries, Transfers, Adjustments
│   │   │   ├── settings/      # Warehouse management
│   │   │   └── Dashboard.js   # Main dashboard
│   │   ├── services/          # API service layer
│   │   │   └── api.js         # Axios configuration & API calls
│   │   ├── layouts/           # Layout components
│   │   └── App.js             # Main app component with routing
│   └── package.json
│
└── server/                    # Node.js Backend Application
    ├── src/
    │   ├── controllers/       # Business logic handlers
    │   │   ├── AuthController.js
    │   │   ├── ProductController.js
    │   │   ├── WarehouseController.js
    │   │   ├── OperationController.js
    │   │   └── ...
    │   ├── models/           # Sequelize database models
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   ├── Warehouse.js
    │   │   ├── Location.js
    │   │   ├── Operation.js
    │   │   ├── StockQuant.js
    │   │   └── ...
    │   ├── routes/            # API route definitions
    │   │   ├── authRoutes.js
    │   │   ├── productRoutes.js
    │   │   └── ...
    │   ├── services/          # Business logic services
    │   │   ├── OperationService.js
    │   │   └── SequenceService.js
    │   ├── middlewares/       # Express middlewares
    │   │   ├── auth.js        # JWT authentication
    │   │   └── errorHandler.js
    │   └── index.js           # Server entry point
    ├── migrations/            # Database migrations
    ├── seeders/              # Database seeders
    └── package.json
```

## 🔑 Key Features

### 1. **Authentication & Authorization**
- User registration with validation (loginId, email, password)
- JWT-based authentication
- Protected routes requiring authentication
- Role-based access (admin, staff)
- Password hashing with bcryptjs

### 2. **Product Management**
- Create, read, update, delete products
- Product attributes: Name, SKU, Unit Cost, Unit of Measure (UOM)
- Product listing with search and filters
- Product details view
- Stock availability tracking

### 3. **Warehouse Management**
- Multi-warehouse support
- Location management within warehouses
- Warehouse details and configuration
- Short codes for warehouse identification

### 4. **Stock Operations**

#### **Receipts** (Incoming Stock)
- Record incoming goods from suppliers
- Multiple items per receipt
- Supplier information tracking
- Status workflow: DRAFT → WAITING → READY → DONE

#### **Deliveries** (Outgoing Stock)
- Record outgoing shipments to customers
- Customer information tracking
- Stock reservation and deduction
- Status workflow management

#### **Transfers** (Internal Movements)
- Move stock between locations
- Source and destination tracking
- Multi-item transfers
- Automatic stock updates

#### **Adjustments** (Stock Corrections)
- Correct stock discrepancies
- Recorded vs. counted quantity
- Reason tracking for adjustments
- Automatic difference calculation

### 5. **Stock Tracking**
- **StockQuants**: Location-based stock levels
  - `onHand`: Physical stock available
  - `reserved`: Stock reserved for operations
  - `freeToUse`: Available stock (onHand - reserved)
- Real-time stock updates on operation validation
- Stock history tracking via StockMoves

### 6. **Operation Workflow**
- **Status Flow**: DRAFT → WAITING → READY → DONE
- **Operation Actions**:
  - **Confirm**: Move from DRAFT to WAITING/READY
  - **Validate**: Execute operation and update stock (DONE)
  - **Cancel**: Cancel operation (CANCELLED)
- Automatic reference generation (e.g., `WH/IN/0001`)
- Operation lines with product quantities

### 7. **Move History**
- Complete audit trail of all stock movements
- Track direction (IN/OUT)
- Reference to originating operation
- Timestamp tracking

### 8. **Dashboard**
- Key Performance Indicators (KPIs)
- Recent activities overview
- Low stock alerts
- Pending operations summary

## 🗄️ Database Schema

### Core Entities

1. **Users**: Authentication and user management
2. **Warehouses**: Warehouse information
3. **Locations**: Storage locations within warehouses
4. **Products**: Product catalog
5. **StockQuants**: Stock levels per location/product
6. **Operations**: Stock operations (Receipts, Deliveries, Transfers, Adjustments)
7. **OperationLines**: Items within operations
8. **StockMoves**: Historical record of stock movements
9. **Sequences**: Reference number generation

### Relationships
- Warehouse → Locations (One-to-Many)
- Warehouse → Operations (One-to-Many)
- Product → StockQuants (One-to-Many)
- Product → OperationLines (One-to-Many)
- Operation → OperationLines (One-to-Many)
- Operation → StockMoves (One-to-Many)
- Location → StockQuants (One-to-Many)

## 🔄 Data Flow

### Operation Creation Flow
1. User creates operation (Receipt/Delivery/Transfer/Adjustment)
2. Operation saved with status `DRAFT`
3. User adds items (OperationLines)
4. User confirms operation → status `WAITING` or `READY`
5. User validates operation → status `DONE`
6. Stock automatically updated:
   - **Receipt**: Stock added to `toLocation`
   - **Delivery**: Stock removed from `fromLocation` (reserved released)
   - **Transfer**: Stock moved from `fromLocation` to `toLocation`
   - **Adjustment**: Stock adjusted at location
7. StockMove records created for audit trail

### Stock Update Logic
- **Receipt**: `onHand += quantity` at `toLocation`
- **Delivery**: `onHand -= quantity` at `fromLocation`, `reserved -= quantity`
- **Transfer**: `onHand -= quantity` at `fromLocation`, `onHand += quantity` at `toLocation`
- **Adjustment**: `onHand = countedQuantity` at location

## 🔐 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcryptjs with salt rounds
3. **Protected Routes**: Frontend route protection
4. **API Middleware**: JWT verification on backend
5. **Input Validation**: Zod schemas for request validation
6. **SQL Injection Protection**: Sequelize ORM parameterized queries
7. **CORS Configuration**: Controlled cross-origin requests
8. **Helmet**: Security headers

## 📡 API Architecture

### RESTful API Design
- **Base URL**: `http://localhost:3000/api`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: JSON
- **Error Handling**: Standardized error responses

### Main Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### Products
- `GET /api/products` - List products (paginated)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Warehouses
- `GET /api/warehouses` - List warehouses
- `POST /api/warehouses` - Create warehouse
- `GET /api/warehouses/:id` - Get warehouse details
- `PATCH /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse
- `GET /api/warehouses/:id/locations` - Get warehouse locations

#### Operations
- `GET /api/operations` - List operations (paginated, filtered)
- `POST /api/operations` - Create operation
- `GET /api/operations/:id` - Get operation details
- `PATCH /api/operations/:id` - Update operation
- `POST /api/operations/:id/confirm` - Confirm operation
- `POST /api/operations/:id/validate` - Validate operation
- `POST /api/operations/:id/cancel` - Cancel operation

#### Stock
- `GET /api/stock/quants` - Get stock levels
- `GET /api/stock/moves` - Get move history

### API Documentation
- Swagger UI available at: `http://localhost:3000/api-docs`

## 🎨 Frontend Architecture

### State Management
- **AuthContext**: Manages user authentication state
  - Login/logout functionality
  - Token storage in localStorage
  - User information
- **InventoryContext**: Manages inventory-related state
  - Products, Warehouses, Operations
  - CRUD operations
  - Data loading and caching

### Component Structure
- **Layout Components**: MainLayout, Sidebar, Topbar
- **Page Components**: Dashboard, ProductList, OperationLists, etc.
- **Form Components**: CreateProduct, CreateReceipt, etc.
- **UI Components**: Reusable Radix UI components

### Routing
- Public routes: `/login`, `/signup`, `/reset-password`
- Protected routes: All other routes require authentication
- Nested routes for organized navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Backend Setup
```bash
cd server
npm install
# Configure .env file with database credentials
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm start
```

### Environment Variables
**Backend (.env)**:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `PORT`

**Frontend (.env)**:
- `REACT_APP_API_URL` (default: http://localhost:3000/api)

## 🔧 Development Workflow

1. **Database Changes**: Create migrations for schema changes
2. **API Development**: Add routes → controllers → services
3. **Frontend Integration**: Update API service → Context → Components
4. **Testing**: Manual testing through UI and API endpoints

## 📊 Key Business Logic

### Reference Generation
- Format: `{WarehouseShortCode}/{TypeCode}/{SequenceNumber}`
- Types: `IN` (Receipt), `OUT` (Delivery), `ADJ` (Adjustment), `TRF` (Transfer)
- Example: `WH/IN/0001` (Warehouse WH, Receipt, Sequence 1)

### Stock Reservation
- Stock reserved when delivery operation is confirmed
- Reserved stock released when delivery is validated or cancelled
- `freeToUse = onHand - reserved`

### Operation Validation
- Validates stock availability before execution
- Updates StockQuants atomically
- Creates StockMove records
- Prevents negative stock (except adjustments)

## 🎯 Use Cases

1. **Receiving Goods**: Create receipt → Add items → Confirm → Validate → Stock updated
2. **Shipping Orders**: Create delivery → Add items → Confirm → Validate → Stock deducted
3. **Moving Stock**: Create transfer → Select locations → Add items → Confirm → Validate → Stock moved
4. **Correcting Stock**: Create adjustment → Select product/location → Enter count → Validate → Stock corrected
5. **Monitoring**: View dashboard → Check KPIs → Review low stock → Track operations

## 🔍 Technical Highlights

1. **Sequelize ORM**: Type-safe database queries
2. **Transaction Support**: Atomic operations for stock updates
3. **Soft Deletes**: Paranoid mode for data retention
4. **Pagination**: Efficient data loading
5. **Error Handling**: Centralized error middleware
6. **Validation**: Zod schemas for type safety
7. **API Interceptors**: Automatic token injection and error handling
8. **Loading States**: User feedback during async operations

## 📝 Future Enhancements

- Real-time notifications
- Advanced reporting and analytics
- Barcode scanning integration
- Multi-currency support
- Batch operations
- Export/Import functionality
- Mobile app support
- Advanced search and filters

## 🤝 Team

**TEAM_BIT** - Odoo Hackathon Project

---

This system provides a robust foundation for inventory management with modern web technologies, following best practices for security, scalability, and maintainability.

