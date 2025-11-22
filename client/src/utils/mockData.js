export const generateMockProducts = () => [
  {
    id: '1',
    name: 'Steel Rods',
    sku: 'STL-001',
    category: 'Raw Materials',
    unit: 'kg',
    stock: 450,
    reorderLevel: 100,
    reorderQuantity: 200,
    locations: [
      { warehouseId: '1', location: 'Rack A', quantity: 250 },
      { warehouseId: '1', location: 'Rack B', quantity: 200 }
    ],
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Office Chairs',
    sku: 'FUR-002',
    category: 'Furniture',
    unit: 'pcs',
    stock: 85,
    reorderLevel: 20,
    reorderQuantity: 50,
    locations: [
      { warehouseId: '1', location: 'Rack C', quantity: 50 },
      { warehouseId: '2', location: 'Main Floor', quantity: 35 }
    ],
    createdAt: '2025-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'LED Bulbs',
    sku: 'ELC-003',
    category: 'Electronics',
    unit: 'pcs',
    stock: 15,
    reorderLevel: 50,
    reorderQuantity: 100,
    locations: [
      { warehouseId: '2', location: 'Shelf 1', quantity: 15 }
    ],
    createdAt: '2025-02-01T09:00:00Z'
  },
  {
    id: '4',
    name: 'Wooden Pallets',
    sku: 'PKG-004',
    category: 'Packaging',
    unit: 'pcs',
    stock: 200,
    reorderLevel: 50,
    reorderQuantity: 100,
    locations: [
      { warehouseId: '1', location: 'Yard', quantity: 200 }
    ],
    createdAt: '2025-02-05T11:20:00Z'
  },
  {
    id: '5',
    name: 'Aluminum Sheets',
    sku: 'MTL-005',
    category: 'Raw Materials',
    unit: 'sheets',
    stock: 120,
    reorderLevel: 30,
    reorderQuantity: 60,
    locations: [
      { warehouseId: '1', location: 'Rack A', quantity: 70 },
      { warehouseId: '2', location: 'Production', quantity: 50 }
    ],
    createdAt: '2025-02-10T16:45:00Z'
  }
];

export const generateMockReceipts = () => [
  {
    id: 'REC-001',
    supplier: 'Steel Corp Inc.',
    status: 'done',
    items: [
      { productId: '1', productName: 'Steel Rods', quantity: 100, unitPrice: 5.50 }
    ],
    totalAmount: 550,
    createdAt: '2025-02-15T10:00:00Z',
    validatedAt: '2025-02-15T14:30:00Z'
  },
  {
    id: 'REC-002',
    supplier: 'Office Supplies Ltd.',
    status: 'waiting',
    items: [
      { productId: '2', productName: 'Office Chairs', quantity: 30, unitPrice: 85.00 }
    ],
    totalAmount: 2550,
    createdAt: '2025-02-18T09:15:00Z'
  },
  {
    id: 'REC-003',
    supplier: 'Electronics Depot',
    status: 'draft',
    items: [
      { productId: '3', productName: 'LED Bulbs', quantity: 150, unitPrice: 3.20 }
    ],
    totalAmount: 480,
    createdAt: '2025-02-20T11:30:00Z'
  }
];

export const generateMockDeliveries = () => [
  {
    id: 'DEL-001',
    customer: 'BuildCo Construction',
    status: 'done',
    items: [
      { productId: '1', productName: 'Steel Rods', quantity: 50 }
    ],
    createdAt: '2025-02-16T08:00:00Z',
    validatedAt: '2025-02-16T10:30:00Z'
  },
  {
    id: 'DEL-002',
    customer: 'Tech Startup Inc.',
    status: 'ready',
    items: [
      { productId: '2', productName: 'Office Chairs', quantity: 10 }
    ],
    createdAt: '2025-02-19T13:00:00Z'
  },
  {
    id: 'DEL-003',
    customer: 'Retail Store Chain',
    status: 'waiting',
    items: [
      { productId: '3', productName: 'LED Bulbs', quantity: 200 }
    ],
    createdAt: '2025-02-21T14:45:00Z'
  }
];

export const generateMockTransfers = () => [
  {
    id: 'TRF-001',
    sourceLocation: 'Warehouse 1 - Rack A',
    destinationLocation: 'Warehouse 2 - Production',
    status: 'done',
    items: [
      { productId: '5', productName: 'Aluminum Sheets', quantity: 30 }
    ],
    createdAt: '2025-02-17T10:00:00Z',
    validatedAt: '2025-02-17T11:15:00Z'
  },
  {
    id: 'TRF-002',
    sourceLocation: 'Warehouse 1 - Rack B',
    destinationLocation: 'Warehouse 1 - Rack C',
    status: 'ready',
    items: [
      { productId: '1', productName: 'Steel Rods', quantity: 50 }
    ],
    createdAt: '2025-02-19T09:30:00Z'
  }
];

export const generateMockAdjustments = () => [
  {
    id: 'ADJ-001',
    productId: '3',
    productName: 'LED Bulbs',
    location: 'Warehouse 2 - Shelf 1',
    recordedStock: 20,
    countedQuantity: 15,
    difference: -5,
    reason: 'Damaged items found during inspection',
    status: 'done',
    createdAt: '2025-02-18T15:00:00Z',
    validatedAt: '2025-02-18T15:30:00Z'
  },
  {
    id: 'ADJ-002',
    productId: '4',
    productName: 'Wooden Pallets',
    location: 'Warehouse 1 - Yard',
    recordedStock: 195,
    countedQuantity: 200,
    difference: 5,
    reason: 'Miscount in previous inventory',
    status: 'draft',
    createdAt: '2025-02-20T16:00:00Z'
  }
];

export const generateMockWarehouses = () => [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Industrial Drive, Springfield, IL 62701',
    manager: 'Sarah Johnson',
    capacity: '10,000 sqft',
    locations: [
      { id: 'loc-1', name: 'Rack A', type: 'Shelf', capacity: '500 units' },
      { id: 'loc-2', name: 'Rack B', type: 'Shelf', capacity: '500 units' },
      { id: 'loc-3', name: 'Rack C', type: 'Shelf', capacity: '300 units' },
      { id: 'loc-4', name: 'Yard', type: 'Outdoor', capacity: '1000 units' }
    ],
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    name: 'Distribution Center',
    address: '456 Commerce Blvd, Chicago, IL 60601',
    manager: 'Michael Chen',
    capacity: '8,000 sqft',
    locations: [
      { id: 'loc-5', name: 'Main Floor', type: 'Open Space', capacity: '800 units' },
      { id: 'loc-6', name: 'Production', type: 'Work Area', capacity: '200 units' },
      { id: 'loc-7', name: 'Shelf 1', type: 'Shelf', capacity: '400 units' }
    ],
    createdAt: '2024-06-15T08:00:00Z'
  }
];

export const generateMockMoveHistory = () => [
  {
    id: '1',
    date: '2025-02-21T14:30:00Z',
    reference: 'REC-001',
    type: 'Receipt',
    productName: 'Steel Rods',
    from: 'Steel Corp Inc.',
    to: 'Main Warehouse',
    quantity: 100,
    status: 'Done'
  },
  {
    id: '2',
    date: '2025-02-20T10:15:00Z',
    reference: 'DEL-001',
    type: 'Delivery',
    productName: 'Steel Rods',
    from: 'Main Warehouse',
    to: 'BuildCo Construction',
    quantity: 50,
    status: 'Done'
  },
  {
    id: '3',
    date: '2025-02-19T11:00:00Z',
    reference: 'TRF-001',
    type: 'Internal Transfer',
    productName: 'Aluminum Sheets',
    from: 'Warehouse 1 - Rack A',
    to: 'Warehouse 2 - Production',
    quantity: 30,
    status: 'Done'
  },
  {
    id: '4',
    date: '2025-02-18T15:30:00Z',
    reference: 'ADJ-001',
    type: 'Adjustment',
    productName: 'LED Bulbs',
    from: 'Warehouse 2 - Shelf 1',
    to: '-',
    quantity: -5,
    status: 'Done'
  },
  {
    id: '5',
    date: '2025-02-17T09:45:00Z',
    reference: 'DEL-002',
    type: 'Delivery',
    productName: 'Office Chairs',
    from: 'Main Warehouse',
    to: 'Tech Startup Inc.',
    quantity: 10,
    status: 'Ready'
  }
];

export const categories = [
  'Raw Materials',
  'Furniture',
  'Electronics',
  'Packaging',
  'Chemicals',
  'Tools',
  'Office Supplies'
];

export const units = [
  'pcs',
  'kg',
  'liters',
  'meters',
  'sheets',
  'boxes',
  'pallets'
];

export const statuses = ['draft', 'waiting', 'ready', 'done', 'cancelled'];

export const documentTypes = ['Receipts', 'Deliveries', 'Internal Transfers', 'Adjustments'];