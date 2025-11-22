import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { categories, units } from '../../utils/mockData';

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, updateProduct } = useInventory();
  const product = products.find(p => p.id === id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'pcs',
    stock: 0,
    reorderLevel: 0,
    reorderQuantity: 0
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        unit: product.unit,
        stock: product.stock,
        reorderLevel: product.reorderLevel,
        reorderQuantity: product.reorderQuantity
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    updateProduct(id, {
      ...formData,
      stock: parseInt(formData.stock),
      reorderLevel: parseInt(formData.reorderLevel),
      reorderQuantity: parseInt(formData.reorderQuantity)
    });
    toast.success('Product updated successfully');
    navigate('/products');
  };

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="animate-fade-in" data-testid="update-product-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="page-title">Update Product</h1>
        <p className="page-subtitle">Edit product details</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} data-testid="update-product-form" className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                data-testid="product-name-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU / Code *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                data-testid="product-sku-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                data-testid="product-category-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit of Measure</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                data-testid="product-unit-select"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                data-testid="product-stock-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                min="0"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Reordering Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reorder Level</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  data-testid="product-reorder-level-input"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reorder Quantity</label>
                <input
                  type="number"
                  name="reorderQuantity"
                  value={formData.reorderQuantity}
                  onChange={handleChange}
                  data-testid="product-reorder-quantity-input"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
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
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;