import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI, warehouseAPI, operationAPI, moveAPI, stockAPI } from '../services/api';
import { toast } from 'sonner';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Load initial data only if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadInitialData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadWarehouses(),
        loadOperations(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Don't show error toast for 401 errors (user not authenticated) or network errors
      if (error.response?.status !== 401 && error.response) {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
=======
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    return newProduct;
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31
  };

  // Products
  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't load if not authenticated
      
      const response = await productAPI.getAll({ page: 1, limit: 1000 });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      // Don't show error if it's a 401 (unauthorized) - that's handled by interceptor
      if (error.response?.status !== 401) {
        console.error('Failed to load products');
      }
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await productAPI.create({
        name: product.name,
        sku: product.sku,
        unitCost: product.unitCost || product.price || 0,
        uom: product.unit || product.uom || 'unit',
      });
      await loadProducts();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product');
      throw error;
    }
  };

<<<<<<< HEAD
  const updateProduct = async (id, updates) => {
    try {
      const response = await productAPI.update(id, {
        name: updates.name,
        sku: updates.sku,
        unitCost: updates.unitCost || updates.price,
        uom: updates.unit || updates.uom,
      });
      await loadProducts();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productAPI.delete(id);
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete product');
      throw error;
    }
  };

  // Warehouses
  const loadWarehouses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't load if not authenticated
      
      const response = await warehouseAPI.getAll({ page: 1, limit: 1000 });
      const warehousesData = response.data.data || [];
      
      // Load locations for each warehouse
      const warehousesWithLocations = await Promise.all(
        warehousesData.map(async (warehouse) => {
          try {
            const locationsResponse = await warehouseAPI.getLocations(warehouse.id, { page: 1, limit: 1000 });
            return {
              ...warehouse,
              locations: locationsResponse.data.data || [],
            };
          } catch (error) {
            return { ...warehouse, locations: [] };
          }
        })
      );
      
      setWarehouses(warehousesWithLocations);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      if (error.response?.status !== 401) {
        console.error('Failed to load warehouses');
      }
    }
  };

  const addWarehouse = async (warehouse) => {
    try {
      const response = await warehouseAPI.create({
        name: warehouse.name,
        shortCode: warehouse.shortCode || warehouse.name.substring(0, 2).toUpperCase(),
        address: warehouse.address || '',
      });
      
      // Create locations if provided
      if (warehouse.locations && warehouse.locations.length > 0) {
        await Promise.all(
          warehouse.locations.map(loc =>
            warehouseAPI.createLocation(response.data.id, {
              name: loc.name,
              shortCode: loc.shortCode || loc.name,
            }).catch(err => console.error('Error creating location:', err))
          )
        );
      }
      
      await loadWarehouses();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create warehouse');
      throw error;
    }
  };

  const updateWarehouse = async (id, updates) => {
    try {
      const response = await warehouseAPI.update(id, {
        name: updates.name,
        shortCode: updates.shortCode,
        address: updates.address,
      });
      await loadWarehouses();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update warehouse');
      throw error;
    }
  };

  const deleteWarehouse = async (id) => {
    try {
      await warehouseAPI.delete(id);
      await loadWarehouses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete warehouse');
      throw error;
    }
  };

  // Operations
  const loadOperations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't load if not authenticated
      
      const response = await operationAPI.getAll({ page: 1, limit: 1000 });
      setOperations(response.data.data || []);
    } catch (error) {
      console.error('Error loading operations:', error);
      if (error.response?.status !== 401) {
        console.error('Failed to load operations');
      }
    }
  };

  // Filter operations by type for backward compatibility
  const receipts = operations.filter(op => op.type === 'RECEIPT');
  const deliveries = operations.filter(op => op.type === 'DELIVERY');
  const transfers = operations.filter(op => op.type === 'TRANSFER');
  const adjustments = operations.filter(op => op.type === 'ADJUSTMENT');

  // Receipt operations
  const addReceipt = async (receipt) => {
    try {
      // Get first warehouse if not specified
      const warehouseId = receipt.warehouseId || (warehouses.length > 0 ? warehouses[0].id : null);
      if (!warehouseId) {
        throw new Error('No warehouse available');
      }
=======
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
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31

      // Get first location if not specified
      const warehouse = warehouses.find(w => w.id === warehouseId);
      const toLocationId = receipt.toLocationId || (warehouse?.locations?.[0]?.id || null);
      if (!toLocationId) {
        throw new Error('No location available in warehouse');
      }

<<<<<<< HEAD
      const response = await operationAPI.create({
        warehouseId,
        type: 'RECEIPT',
        toLocationId,
        fromParty: receipt.supplier || '',
        scheduledAt: new Date().toISOString(),
        lines: (receipt.items || []).map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
=======
  const validateReceipt = (id) => {
    const receipt = receipts.find(r => r.id === id);
    if (receipt) {
      receipt.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(product.id, { stock: product.stock + item.quantity });
        }
      });
      updateReceipt(id, { status: 'done', validatedAt: new Date().toISOString() });
      addMoveHistory({
        type: 'receipt',
        referenceId: id,
        items: receipt.items
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31
      });
      
      await loadOperations();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create receipt');
      throw error;
    }
  };

<<<<<<< HEAD
  // Delivery operations
  const addDelivery = async (delivery) => {
    try {
      const warehouseId = delivery.warehouseId || (warehouses.length > 0 ? warehouses[0].id : null);
      if (!warehouseId) {
        throw new Error('No warehouse available');
      }
=======
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
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31

      const warehouse = warehouses.find(w => w.id === warehouseId);
      const fromLocationId = delivery.fromLocationId || (warehouse?.locations?.[0]?.id || null);
      if (!fromLocationId) {
        throw new Error('No location available in warehouse');
      }

<<<<<<< HEAD
      const response = await operationAPI.create({
        warehouseId,
        type: 'DELIVERY',
        fromLocationId,
        toParty: delivery.customer || '',
        scheduledAt: new Date().toISOString(),
        lines: (delivery.items || []).map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
=======
  const validateDelivery = (id) => {
    const delivery = deliveries.find(d => d.id === id);
    if (delivery) {
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
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31
      });
      
      await loadOperations();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create delivery');
      throw error;
    }
  };

<<<<<<< HEAD
  // Transfer operations
  const addTransfer = async (transfer) => {
    try {
      // Parse location strings like "Warehouse Name - Location Name"
      const parseLocation = (locationString) => {
        const parts = locationString.split(' - ');
        const warehouseName = parts[0];
        const locationName = parts[1] || parts[0];
        
        const warehouse = warehouses.find(w => w.name === warehouseName);
        if (!warehouse) return null;
        
        const location = warehouse.locations?.find(l => l.name === locationName || `${warehouse.name} - ${l.name}` === locationString);
        return location ? { warehouseId: warehouse.id, locationId: location.id } : null;
      };
=======
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
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31

      const source = parseLocation(transfer.sourceLocation);
      const destination = parseLocation(transfer.destinationLocation);
      
      if (!source || !destination) {
        throw new Error('Invalid source or destination location');
      }

      const response = await operationAPI.create({
        warehouseId: source.warehouseId,
        type: 'TRANSFER',
        fromLocationId: source.locationId,
        toLocationId: destination.locationId,
        scheduledAt: new Date().toISOString(),
        lines: (transfer.items || []).map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
        })),
      });
      
      await loadOperations();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create transfer');
      throw error;
    }
  };

<<<<<<< HEAD
  // Adjustment operations
  const addAdjustment = async (adjustment) => {
    try {
      // Parse location string
      const parseLocation = (locationString) => {
        const parts = locationString.split(' - ');
        const warehouseName = parts[0];
        const locationName = parts[1] || parts[0];
        
        const warehouse = warehouses.find(w => w.name === warehouseName);
        if (!warehouse) return null;
        
        const location = warehouse.locations?.find(l => l.name === locationName || `${warehouse.name} - ${l.name}` === locationString);
        return location ? { warehouseId: warehouse.id, locationId: location.id } : null;
      };
=======
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
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31

      const location = parseLocation(adjustment.location);
      if (!location) {
        throw new Error('Invalid location');
      }

      // Calculate delta
      const delta = adjustment.countedQuantity - adjustment.recordedStock;

      const response = await operationAPI.create({
        warehouseId: location.warehouseId,
        type: 'ADJUSTMENT',
        fromLocationId: location.locationId,
        toLocationId: location.locationId,
        note: adjustment.reason || '',
        scheduledAt: new Date().toISOString(),
        lines: [{
          productId: parseInt(adjustment.productId),
          quantity: Math.abs(delta), // Backend handles sign via adjustment logic
        }],
      });
      
      await loadOperations();
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create adjustment');
      throw error;
    }
  };

<<<<<<< HEAD
  // Operation actions (confirm, validate, cancel)
  const confirmOperation = async (id) => {
    try {
      await operationAPI.confirm(id);
      await loadOperations();
      toast.success('Operation confirmed');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to confirm operation');
      throw error;
    }
=======
  const addWarehouse = (warehouse) => {
    const newWarehouse = {
      ...warehouse,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setWarehouses([...warehouses, newWarehouse]);
    return newWarehouse;
>>>>>>> f570278a8b5c01c481fbc37964756b0bf8d83a31
  };

  const validateOperation = async (id) => {
    try {
      await operationAPI.validate(id);
      await loadOperations();
      await loadProducts(); // Reload products as stock may have changed
      toast.success('Operation validated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to validate operation');
      throw error;
    }
  };

  const cancelOperation = async (id) => {
    try {
      await operationAPI.cancel(id);
      await loadOperations();
      toast.success('Operation cancelled');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel operation');
      throw error;
    }
  };

  // Backward compatibility methods
  const updateReceipt = async (id, updates) => {
    try {
      await operationAPI.update(id, updates);
      await loadOperations();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update receipt');
      throw error;
    }
  };

  const validateReceipt = (id) => {
    return validateOperation(id);
  };

  const updateDelivery = async (id, updates) => {
    try {
      await operationAPI.update(id, updates);
      await loadOperations();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update delivery');
      throw error;
    }
  };

  const validateDelivery = (id) => {
    return validateOperation(id);
  };

  const updateTransfer = async (id, updates) => {
    try {
      await operationAPI.update(id, updates);
      await loadOperations();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update transfer');
      throw error;
    }
  };

  const validateTransfer = (id) => {
    return validateOperation(id);
  };

  const updateAdjustment = async (id, updates) => {
    try {
      await operationAPI.update(id, updates);
      await loadOperations();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update adjustment');
      throw error;
    }
  };

  const validateAdjustment = (id) => {
    return validateOperation(id);
  };

  // Move History
  const loadMoveHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't load if not authenticated
      
      const response = await moveAPI.getMoves({ page: 1, limit: 1000 });
      setMoves(response.data.data || []);
    } catch (error) {
      console.error('Error loading move history:', error);
      if (error.response?.status !== 401) {
        console.error('Failed to load move history');
      }
    }
  };

  const addMoveHistory = (move) => {
    // This is handled automatically by backend when operations are validated
    loadMoveHistory();
  };

  // Load move history on mount (only if authenticated)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadMoveHistory();
    }
  }, []);

  const moveHistory = moves;

  const value = {
    products,
    receipts,
    deliveries,
    transfers,
    adjustments,
    warehouses,
    moveHistory,
    loading,
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
    deleteWarehouse,
    addMoveHistory,
    // Direct operation methods
    confirmOperation,
    validateOperation,
    cancelOperation,
    // Reload methods
    loadProducts,
    loadWarehouses,
    loadOperations,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};
