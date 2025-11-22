import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const { addWarehouse } = useInventory();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [manager, setManager] = useState('');
  const [capacity, setCapacity] = useState('');
  const [locations, setLocations] = useState([{ name: '', type: '', capacity: '' }]);

  const addLocation = () => {
    setLocations([...locations, { name: '', type: '', capacity: '' }]);
  };

  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const updateLocation = (index, field, value) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !manager || !capacity) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    addWarehouse({
      name,
      address,
      manager,
      capacity,
      locations: locations.filter(l => l.name).map((l, idx) => ({
        id: `loc-${Date.now()}-${idx}`,
        name: l.name,
        type: l.type || 'General',
        capacity: l.capacity || 'N/A'
      }))
    });
    
    toast.success('Warehouse created successfully');
    navigate('/settings/warehouses');
  };

  return (
    <div className="animate-fade-in" data-testid="create-warehouse-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <h1 className="page-title">Create New Warehouse</h1>
        <p className="page-subtitle">Add a new warehouse location</p>
      </div>

      <form onSubmit={handleSubmit} data-testid="create-warehouse-form" className="max-w-4xl space-y-6">
        {/* Warehouse Info */}
        <div className="card space-y-6">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>Warehouse Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="warehouse-name-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter warehouse name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Manager *</label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                data-testid="warehouse-manager-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Manager name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                data-testid="warehouse-address-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity *</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                data-testid="warehouse-capacity-input"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., 5,000 sqft"
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>Storage Locations</h3>
            <button
              type="button"
              onClick={addLocation}
              data-testid="add-location-button"
              className="flex items-center px-3 py-1.5 text-sm bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Location
            </button>
          </div>
          
          <div className="space-y-4">
            {locations.map((location, index) => (
              <div key={index} data-testid={`location-${index}`} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Location Name</label>
                  <input
                    type="text"
                    value={location.name}
                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
                    data-testid={`location-name-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Rack A"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                  <input
                    type="text"
                    value={location.type}
                    onChange={(e) => updateLocation(index, 'type', e.target.value)}
                    data-testid={`location-type-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Shelf"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
                  <input
                    type="text"
                    value={location.capacity}
                    onChange={(e) => updateLocation(index, 'capacity', e.target.value)}
                    data-testid={`location-capacity-${index}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 100 units"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  {locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      data-testid={`remove-location-${index}`}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
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
            Create Warehouse
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWarehouse;