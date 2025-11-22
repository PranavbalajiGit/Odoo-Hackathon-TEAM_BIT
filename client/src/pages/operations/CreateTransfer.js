import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const CreateTransfer = () => {
  const navigate = useNavigate();
  const { products, warehouses, addTransfer } = useInventory();
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [items, setItems] = useState([{ productId: '', productName: '', quantity: 0 }]);

  const locations = warehouses.flatMap(w => 
    w.locations.map(l => `${w.name} - ${l.name}`)
  );

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', quantity: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].productName = product.name;
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sourceLocation || !destinationLocation) {
      toast.error('Please select source and destination locations');
      return;
    }
    if (sourceLocation === destinationLocation) {
      toast.error('Source and destination cannot be the same');
      return;
    }
    if (items.length === 0 || items.some(i => !i.productId || i.quantity <= 0)) {
      toast.error('Please add valid items');
      return;
    }
    
    addTransfer({
      sourceLocation,
      destinationLocation,
      items: items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: parseInt(i.quantity)
      }))
    });
    
    toast.success('Transfer created successfully');
    navigate('/operations/transfers');
  };

  return (
    <div className="animate-fade-in" data-testid="create-transfer-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="page-title">Create Internal Transfer</h1>
        <p className="page-subtitle">Move stock between locations</p>
      </div>

      <form onSubmit={handleSubmit} data-testid="create-transfer-form" className="max-w-4xl space-y-6">
       
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Transfer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Source Location *</label>
              <select
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                data-testid="source-location-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select source</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination Location *</label>
              <select
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                data-testid="destination-location-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select destination</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

   
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>Items to Transfer</h3>
            <button
              type="button"
              onClick={addItem}
              data-testid="add-item-button"
              className="flex items-center px-3 py-1.5 text-sm bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} data-testid={`item-${index}`} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-8">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    data-testid={`product-select-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    data-testid={`quantity-input-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    min="0"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      data-testid={`remove-item-${index}`}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            data-testid="cancel-button"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="submit-button"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700"
          >
            Create Transfer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransfer;