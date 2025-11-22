import { createContext, useContext, useState } from 'react';
import { generateMockProducts, generateMockReceipts, generateMockDeliveries, generateMockTransfers, generateMockAdjustments, generateMockWarehouses, generateMockMoveHistory } from '../utils/mockData';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(generateMockProducts());
  const [receipts, setReceipts] = useState(generateMockReceipts());
  const [deliveries, setDeliveries] = useState(generateMockDeliveries());
  const [transfers, setTransfers] = useState(generateMockTransfers());
  const [adjustments, setAdjustments] = useState(generateMockAdjustments());
  const [warehouses, setWarehouses] = useState(generateMockWarehouses());
  const [moveHistory, setMoveHistory] = useState(generateMockMoveHistory());

  // Product operations
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Receipt operations
  const addReceipt = (receipt) => {
    const newReceipt = {
      ...receipt,
      id: `REC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setReceipts([...receipts, newReceipt]);
    return newReceipt;
  };

  const updateReceipt = (id, updates) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const validateReceipt = (id) => {
    const receipt = receipts.find(r => r.id === id);
    if (receipt) {
      // Update stock
      receipt.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(product.id, { stock: product.stock + item.quantity });
        }
      });
      // Update receipt status
      updateReceipt(id, { status: 'done', validatedAt: new Date().toISOString() });
      // Add to move history
      addMoveHistory({
        type: 'receipt',
        referenceId: id,
        items: receipt.items
      });
    }
  };

  // Delivery operations
  const addDelivery = (delivery) => {
    const newDelivery = {
      ...delivery,
      id: `DEL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setDeliveries([...deliveries, newDelivery]);
    return newDelivery;
  };

  const updateDelivery = (id, updates) => {
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const validateDelivery = (id) => {
    const delivery = deliveries.find(d => d.id === id);
    if (delivery) {
      // Update stock
      delivery.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(product.id, { stock: Math.max(0, product.stock - item.quantity) });
        }
      });
      updateDelivery(id, { status: 'done', validatedAt: new Date().toISOString() });
      addMoveHistory({
        type: 'delivery',
        referenceId: id,
        items: delivery.items
      });
    }
  };

  // Transfer operations
  const addTransfer = (transfer) => {
    const newTransfer = {
      ...transfer,
      id: `TRF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setTransfers([...transfers, newTransfer]);
    return newTransfer;
  };

  const updateTransfer = (id, updates) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const validateTransfer = (id) => {
    const transfer = transfers.find(t => t.id === id);
    if (transfer) {
      updateTransfer(id, { status: 'done', validatedAt: new Date().toISOString() });
      addMoveHistory({
        type: 'transfer',
        referenceId: id,
        items: transfer.items,
        from: transfer.sourceLocation,
        to: transfer.destinationLocation
      });
    }
  };

  // Adjustment operations
  const addAdjustment = (adjustment) => {
    const newAdjustment = {
      ...adjustment,
      id: `ADJ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setAdjustments([...adjustments, newAdjustment]);
    return newAdjustment;
  };

  const updateAdjustment = (id, updates) => {
    setAdjustments(adjustments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const validateAdjustment = (id) => {
    const adjustment = adjustments.find(a => a.id === id);
    if (adjustment) {
      const product = products.find(p => p.id === adjustment.productId);
      if (product) {
        updateProduct(product.id, { stock: adjustment.countedQuantity });
      }
      updateAdjustment(id, { status: 'done', validatedAt: new Date().toISOString() });
      addMoveHistory({
        type: 'adjustment',
        referenceId: id,
        productId: adjustment.productId,
        difference: adjustment.difference
      });
    }
  };

  // Warehouse operations
  const addWarehouse = (warehouse) => {
    const newWarehouse = {
      ...warehouse,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWarehouses([...warehouses, newWarehouse]);
    return newWarehouse;
  };

  const updateWarehouse = (id, updates) => {
    setWarehouses(warehouses.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWarehouse = (id) => {
    setWarehouses(warehouses.filter(w => w.id !== id));
  };

  // Move history
  const addMoveHistory = (move) => {
    const newMove = {
      ...move,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setMoveHistory([newMove, ...moveHistory]);
  };

  const value = {
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    warehouses,
    moveHistory,
    addProduct,
    updateProduct,
    deleteProduct,
    addReceipt,
    updateReceipt,
    validateReceipt,
    addDelivery,
    updateDelivery,
    validateDelivery,
    addTransfer,
    updateTransfer,
    validateTransfer,
    addAdjustment,
    updateAdjustment,
    validateAdjustment,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};