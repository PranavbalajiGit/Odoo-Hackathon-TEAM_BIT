import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { ArrowLeft, Edit, Package, MapPin } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useInventory();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-cyan-600 hover:text-cyan-700">Go back to products</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" data-testid="product-details-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">{product.name}</h1>
            <p className="page-subtitle">Product Details & Stock Information</p>
          </div>
          <Link to={`/products/${id}/edit`} data-testid="edit-product-button">
            <button className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center" style={{ fontFamily: 'Space Grotesk' }}>
              <Package className="w-5 h-5 mr-2" />
              Product Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Product Name</p>
                <p className="text-base text-gray-900">{product.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">SKU</p>
                <p className="text-base text-gray-900">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                <p className="text-base text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Unit of Measure</p>
                <p className="text-base text-gray-900">{product.unit}</p>
              </div>
            </div>
          </div>

          {/* Stock Locations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center" style={{ fontFamily: 'Space Grotesk' }}>
              <MapPin className="w-5 h-5 mr-2" />
              Stock Locations
            </h3>
            <div className="space-y-3">
              {product.locations && product.locations.length > 0 ? (
                product.locations.map((loc, idx) => (
                  <div key={idx} data-testid={`location-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{loc.location}</p>
                      <p className="text-xs text-gray-500">Warehouse ID: {loc.warehouseId}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{loc.quantity} {product.unit}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No location data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Stock Summary & Reorder Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Stock Summary</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Stock</p>
                <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>{product.stock}</p>
                <p className="text-sm text-gray-500 mt-1">{product.unit}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 mb-1">Reorder Level</p>
                <p className="text-lg font-semibold text-gray-900">{product.reorderLevel} {product.unit}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 mb-1">Reorder Quantity</p>
                <p className="text-lg font-semibold text-gray-900">{product.reorderQuantity} {product.unit}</p>
              </div>
              {product.stock <= product.reorderLevel && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-600 uppercase">⚠ Low Stock Alert</p>
                  <p className="text-xs text-red-600 mt-1">Stock is below reorder level</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;