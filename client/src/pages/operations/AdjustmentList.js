import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AdjustmentList = () => {
  const { adjustments, validateAdjustment } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAdjustments = adjustments.filter(a =>
    statusFilter === 'all' || a.status === statusFilter
  );

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
          <option value="draft">Draft</option>
          <option value="done">Done</option>
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
              {filteredAdjustments.map((adjustment) => (
                <tr key={adjustment.id} data-testid={`adjustment-row-${adjustment.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{adjustment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{adjustment.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{adjustment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{adjustment.recordedStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{adjustment.countedQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${adjustment.difference < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {adjustment.difference > 0 ? '+' : ''}{adjustment.difference}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge status-${adjustment.status}`}>{adjustment.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {adjustment.status !== 'done' && (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentList;