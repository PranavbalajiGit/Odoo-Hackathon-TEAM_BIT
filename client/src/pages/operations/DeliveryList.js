import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeliveryList = () => {
  const { deliveries, validateDelivery, loading } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const deliveriesList = deliveries || [];
  const filteredDeliveries = deliveriesList.filter(d => {
    if (!d) return false;
    const status = d.status || 'DRAFT';
    return statusFilter === 'all' || status === statusFilter;
  });

  const handleValidate = (id) => {
    validateDelivery(id);
    toast.success('Delivery validated. Stock updated.');
  };

  return (
    <div className="animate-fade-in" data-testid="delivery-list-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Deliveries</h1>
          <p className="page-subtitle">Manage outgoing shipments to customers</p>
        </div>
        <Link to="/operations/deliveries/create" data-testid="create-delivery-button">
          <button className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            New Delivery
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No deliveries found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery) => {
                  const items = delivery.lines || delivery.items || [];
                  const status = delivery.status || 'DRAFT';
                  return (
                    <tr key={delivery.id} data-testid={`delivery-row-${delivery.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.reference || delivery.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{delivery.toParty || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{items.length} item(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {status !== 'DONE' && (
                          <button
                            onClick={() => handleValidate(delivery.id)}
                            data-testid={`validate-delivery-${delivery.id}`}
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

export default DeliveryList;