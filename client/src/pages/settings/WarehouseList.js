import { useInventory } from '../../context/InventoryContext';
import { Link } from 'react-router-dom';
import { Plus, Eye, MapPin } from 'lucide-react';

const WarehouseList = () => {
  const { warehouses } = useInventory();

  return (
    <div className="animate-fade-in" data-testid="warehouse-list-page">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Warehouses</h1>
          <p className="page-subtitle">Manage warehouse locations and settings</p>
        </div>
        <Link to="/settings/warehouses/create" data-testid="create-warehouse-button">
          <button className="flex items-center px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Warehouse
          </button>
        </Link>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} data-testid={`warehouse-card-${warehouse.id}`} className="card card-hover">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Space Grotesk' }}>{warehouse.name}</h3>
              <div className="flex items-start text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                <p>{warehouse.address}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Manager:</span>
                <span className="font-medium text-gray-900">{warehouse.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Capacity:</span>
                <span className="font-medium text-gray-900">{warehouse.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Locations:</span>
                <span className="font-medium text-gray-900">{warehouse.locations.length}</span>
              </div>
            </div>

            <Link to={`/settings/warehouses/${warehouse.id}`} data-testid={`view-warehouse-${warehouse.id}`}>
              <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseList;