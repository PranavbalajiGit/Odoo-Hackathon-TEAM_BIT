import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, FileText, TruckIcon, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import { statuses, documentTypes } from '../utils/mockData';

const Dashboard = () => {
  const { products, receipts, deliveries, transfers } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');
  const [docTypeFilter, setDocTypeFilter] = useState('all');

  const totalProducts = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock <= p.reorderLevel).length;
  const pendingReceipts = receipts.filter(r => r.status === 'waiting' || r.status === 'ready').length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'waiting' || d.status === 'ready').length;
  const scheduledTransfers = transfers.filter(t => t.status === 'ready').length;

  const kpis = [
    { label: 'Total Products in Stock', value: totalProducts, icon: Package, color: 'cyan', testId: 'kpi-total-products' },
    { label: 'Low Stock / Out of Stock', value: lowStockItems, icon: AlertTriangle, color: 'red', testId: 'kpi-low-stock' },
    { label: 'Pending Receipts', value: pendingReceipts, icon: FileText, color: 'blue', testId: 'kpi-pending-receipts' },
    { label: 'Pending Deliveries', value: pendingDeliveries, icon: TruckIcon, color: 'emerald', testId: 'kpi-pending-deliveries' },
    { label: 'Internal Transfers Scheduled', value: scheduledTransfers, icon: ArrowLeftRight, color: 'purple', testId: 'kpi-scheduled-transfers' },
  ];

  const recentActivities = [
    ...receipts.slice(0, 3).map(r => ({ ...r, type: 'Receipt' })),
    ...deliveries.slice(0, 3).map(d => ({ ...d, type: 'Delivery' })),
    ...transfers.slice(0, 2).map(t => ({ ...t, type: 'Transfer' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="animate-fade-in" data-testid="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Monitor your inventory operations at a glance</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="status-filter"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Type</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              data-testid="doctype-filter"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              {documentTypes.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} data-testid={kpi.testId} className="card card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{kpi.label}</p>
                  <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>{kpi.value}</p>
                </div>
                <div className={`p-3 bg-${kpi.color}-50 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} data-testid={`activity-${activity.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <span className={`status-badge status-${activity.status}`}>{activity.status}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.id}</p>
                    <p className="text-xs text-gray-500">{activity.type}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Low Stock Alerts</h3>
          <div className="space-y-3">
            {products.filter(p => p.stock <= p.reorderLevel).slice(0, 5).map((product) => (
              <div key={product.id} data-testid={`low-stock-${product.id}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{product.stock} {product.unit}</p>
                  <p className="text-xs text-gray-500">Reorder at {product.reorderLevel}</p>
                </div>
              </div>
            ))}
            {products.filter(p => p.stock <= p.reorderLevel).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;