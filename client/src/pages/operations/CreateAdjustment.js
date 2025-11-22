import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CreateAdjustment = () => {
  const navigate = useNavigate();
  const { products = [], warehouses = [], addAdjustment } = useInventory();
  const [productId, setProductId] = useState('');
  const [location, setLocation] = useState('');
  const [countedQuantity, setCountedQuantity] = useState(0);
  const [reason, setReason] = useState('');

  const locations = (warehouses || []).flatMap(w => 
    (w.locations || []).map(l => `${w.name} - ${l.name}`)
  );

  const selectedProduct = (products || []).find(p => p.id === productId);
  const recordedStock = selectedProduct?.stock || 0;
  const difference = countedQuantity - recordedStock;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId || !location) {
      toast.error('Please select product and location');
      return;
    }
    
    if (!selectedProduct) {
      toast.error('Selected product not found');
      return;
    }
    
    addAdjustment({
      productId,
      productName: selectedProduct.name || 'Unknown Product',
      location,
      recordedStock,
      countedQuantity: parseInt(countedQuantity),
      difference,
      reason
    });
    
    toast.success('Adjustment created successfully');
    navigate('/operations/adjustments');
  };

  return (
    <div className="animate-fade-in" data-testid="create-adjustment-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="page-title">Create Stock Adjustment</h1>
        <p className="page-subtitle">Correct stock discrepancies</p>
      </div>

      <form onSubmit={handleSubmit} data-testid="create-adjustment-form" className="max-w-3xl space-y-6">
        <div className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product *</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                data-testid="product-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select product</option>
                {(products || []).map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="location-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select location</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {selectedProduct && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">Recorded Stock: <span className="text-2xl font-bold">{recordedStock}</span> {selectedProduct.uom || selectedProduct.unit || 'units'}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Counted Quantity *</label>
            <input
              type="number"
              value={countedQuantity}
              onChange={(e) => setCountedQuantity(e.target.value)}
              data-testid="counted-quantity-input"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              min="0"
              placeholder="Enter physical count"
            />
          </div>

          {selectedProduct && countedQuantity !== '' && (
            <div className={`p-4 rounded-lg border ${difference < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-sm font-semibold ${difference < 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                Difference: <span className="text-2xl">{difference > 0 ? '+' : ''}{difference}</span> {selectedProduct.uom || selectedProduct.unit || 'units'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              data-testid="reason-textarea"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="3"
              placeholder="Reason for adjustment (optional)"
            />
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
            Create Adjustment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdjustment;