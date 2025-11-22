import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AdjustmentList = () => {
  const { adjustments, validateAdjustment, loading } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const adjustmentsList = adjustments || [];
  const filteredAdjustments = adjustmentsList.filter(a => {
    if (!a) return false;
    const status = a.status || 'DRAFT';
    return statusFilter === 'all' || status === statusFilter;
  });

  const handleValidate = (id) => {
    validateAdjustment(id);
    toast.success('Adjustment validated. Stock updated.');
  };

  return (
    <div className="animate-fade-in" data-testid="adjustment-list-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Adjustments</h1>
          <p className="page-subtitle">Correct stock discrepancies</p>
        </div>
        <Link to="/operations/adjustments/create" data-testid="create-adjustment-button">
          <button className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            New Adjustment
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="status-filter"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="WAITING">Waiting</option>
          <option value="READY">Ready</option>
          <option value="DONE">Done</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Adjustments Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Adjustment ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recorded</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Counted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Difference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No adjustments found
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((adjustment) => {
                  const status = adjustment.status || 'DRAFT';
                  const lines = adjustment.lines || [];
                  const firstLine = lines[0] || {};
                  // For adjustments, we need to calculate from the operation data
                  const productName = adjustment.productName || `Product ${firstLine.productId || 'N/A'}`;
                  const location = adjustment.location || adjustment.toLocation?.name || adjustment.fromLocation?.name || 'N/A';
                  const recordedStock = adjustment.recordedStock || 0;
                  const countedQuantity = adjustment.countedQuantity || firstLine.quantity || 0;
                  const difference = countedQuantity - recordedStock;
                  
                  return (
                    <tr key={adjustment.id} data-testid={`adjustment-row-${adjustment.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adjustment.reference || adjustment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{recordedStock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{countedQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${difference < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {difference > 0 ? '+' : ''}{difference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {status !== 'DONE' && (
                          <button
                            onClick={() => handleValidate(adjustment.id)}
                            data-testid={`validate-adjustment-${adjustment.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Validate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentList;