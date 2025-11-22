import { useInventory } from '../../context/InventoryContext';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

const MoveHistory = () => {
  const { moveHistory } = useInventory();
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = moveHistory.filter(h => {
    const matchesType = typeFilter === 'all' || h.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesSearch = h.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="animate-fade-in" data-testid="move-history-page">
      <div className="page-header">
        <h1 className="page-title">Move History</h1>
        <p className="page-subtitle">Track all stock movements</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by reference or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-history-input"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              data-testid="type-filter"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="delivery">Deliveries</option>
              <option value="transfer">Internal Transfers</option>
              <option value="adjustment">Adjustments</option>
            </select>
          </div>
        </div>
      </div>

      {/* Move History Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((move) => (
                <tr key={move.id} data-testid={`move-history-row-${move.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                      {new Date(move.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{move.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">{move.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{move.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{move.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{move.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${move.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {move.quantity > 0 ? '+' : ''}{move.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge status-${move.status.toLowerCase()}`}>{move.status}</span>
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

export default MoveHistory;