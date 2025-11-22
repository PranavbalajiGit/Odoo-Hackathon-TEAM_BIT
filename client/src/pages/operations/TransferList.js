import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const TransferList = () => {
  const { transfers, validateTransfer, loading } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const transfersList = transfers || [];
  const filteredTransfers = transfersList.filter(t => {
    if (!t) return false;
    const status = t.status || 'DRAFT';
    return statusFilter === 'all' || status === statusFilter;
  });

  const handleValidate = (id) => {
    validateTransfer(id);
    toast.success('Transfer validated successfully.');
  };

  return (
    <div className="animate-fade-in" data-testid="transfer-list-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Internal Transfers</h1>
          <p className="page-subtitle">Manage stock movements between locations</p>
        </div>
        <Link to="/operations/transfers/create" data-testid="create-transfer-button">
          <button className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            New Transfer
          </button>
        </Link>
      </div>

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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transfer ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No transfers found
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((transfer) => {
                  const items = transfer.lines || transfer.items || [];
                  const status = transfer.status || 'DRAFT';
                  const fromLocation = transfer.fromLocation?.name || transfer.fromLocationId || 'N/A';
                  const toLocation = transfer.toLocation?.name || transfer.toLocationId || 'N/A';
                  return (
                    <tr key={transfer.id} data-testid={`transfer-row-${transfer.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transfer.reference || transfer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{fromLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{toLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{items.length} item(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {status !== 'DONE' && (
                          <button
                            onClick={() => handleValidate(transfer.id)}
                            data-testid={`validate-transfer-${transfer.id}`}
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

export default TransferList;