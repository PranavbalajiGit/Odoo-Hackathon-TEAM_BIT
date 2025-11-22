import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { ArrowLeft, MapPin, User, Package } from 'lucide-react';

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { warehouses } = useInventory();
  const warehouse = warehouses.find(w => w.id === id);

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Warehouse not found</p>
        <button onClick={() => navigate('/settings/warehouses')} className="mt-4 text-cyan-600 hover:text-cyan-700">Go back</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" data-testid="warehouse-details-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="page-title">{warehouse.name}</h1>
        <p className="page-subtitle">Warehouse configuration and details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Warehouse Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                  <p className="text-base text-gray-900">{warehouse.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Manager</p>
                  <p className="text-base text-gray-900">{warehouse.manager}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Capacity</p>
                  <p className="text-base text-gray-900">{warehouse.capacity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Locations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Storage Locations</h3>
            <div className="space-y-3">
              {warehouse.locations.map((location) => (
                <div key={location.id} data-testid={`location-${location.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="text-sm font-semibold text-gray-900">{location.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Space Grotesk' }}>Summary</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Locations</p>
              <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>{warehouse.locations.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">Created On</p>
              <p className="text-sm text-gray-900">{new Date(warehouse.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDetails;