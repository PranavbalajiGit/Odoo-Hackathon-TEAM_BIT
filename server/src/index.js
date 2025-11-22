const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Management API',
    version: '1.0.0',
    description: 'API for managing inventory, warehouses, products, and operations',
  },
  servers: [
    {
      url: `http://localhost:${PORT}/api`,
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Warehouses', description: 'Warehouse management' },
    { name: 'Locations', description: 'Location management' },
    { name: 'Products', description: 'Product management' },
    { name: 'Stock', description: 'Stock management' },
    { name: 'Operations', description: 'Operation management' },
    { name: 'Moves', description: 'Move history' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          loginId: { type: 'string', example: 'admin01' },
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          role: { type: 'string', enum: ['admin', 'staff'], example: 'admin' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Warehouse: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Acme Interior' },
          shortCode: { type: 'string', example: 'WH' },
          address: { type: 'string', example: '123 Main St' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Location: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          warehouseId: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Stock1' },
          shortCode: { type: 'string', example: 'Stock1' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Desk' },
          sku: { type: 'string', example: 'DESK001' },
          unitCost: { type: 'number', format: 'float', example: 3000.00 },
          uom: { type: 'string', example: 'unit' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      StockQuant: {
        type: 'object',
        properties: {
          warehouseId: { type: 'integer', example: 1 },
          locationId: { type: 'integer', example: 1 },
          productId: { type: 'integer', example: 1 },
          onHand: { type: 'integer', example: 50 },
          reserved: { type: 'integer', example: 5 },
          freeToUse: { type: 'integer', example: 45 },
        },
      },
      Operation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          reference: { type: 'string', example: 'WH/IN/0001' },
          type: { type: 'string', enum: ['RECEIPT', 'DELIVERY', 'ADJUSTMENT'], example: 'RECEIPT' },
          fromLocationId: { type: 'integer', nullable: true },
          toLocationId: { type: 'integer', nullable: true },
          fromParty: { type: 'string', nullable: true, example: 'Acme Interior' },
          toParty: { type: 'string', nullable: true },
          scheduledAt: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELLED'], example: 'READY' },
          note: { type: 'string', nullable: true },
          lines: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OperationLine'
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      OperationLine: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          operationId: { type: 'integer' },
          productId: { type: 'integer', example: 1 },
          quantity: { type: 'integer', example: 10 },
          unitCostSnapshot: { type: 'number', format: 'float', example: 3000.00 },
        },
      },
      StockMove: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          operationId: { type: 'integer' },
          productId: { type: 'integer', example: 1 },
          qty: { type: 'integer', example: 10 },
          fromLocationId: { type: 'integer', nullable: true },
          toLocationId: { type: 'integer', nullable: true },
          movedAt: { type: 'string', format: 'date-time' },
          reference: { type: 'string', example: 'WH/IN/0001' },
          direction: { type: 'string', enum: ['IN', 'OUT'], example: 'IN' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling
app.use(errorHandler);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});