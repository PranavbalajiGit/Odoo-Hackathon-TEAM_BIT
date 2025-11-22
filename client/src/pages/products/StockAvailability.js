import { useInventory } from '../../context/InventoryContext';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

const StockAvailability = () => {
  const { products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" data-testid="stock-availability-page">
      <div className="page-header">
        <h1 className="page-title">Stock Availability</h1>
        <p className="page-subtitle">View product stock across all locations</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-stock-input"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} data-testid={`product-availability-${product.id}`} className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>{product.name}</h3>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-2xl font-bold text-cyan-600 mt-2" style={{ fontFamily: 'Space Grotesk' }}>{product.stock} {product.unit}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Locations
              </h4>
              {product.locations && product.locations.length > 0 ? (
                <div className="space-y-2">
                  {product.locations.map((loc, idx) => (
                    <div key={idx} data-testid={`location-${product.id}-${idx}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{loc.location}</span>
                      <span className="text-sm font-semibold text-gray-900">{loc.quantity} {product.unit}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No location data</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAvailability;