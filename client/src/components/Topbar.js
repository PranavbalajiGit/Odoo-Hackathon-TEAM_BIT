import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/receipts')) return 'Receipts';
    if (path.includes('/deliveries')) return 'Deliveries';
    if (path.includes('/transfers')) return 'Internal Transfers';
    if (path.includes('/adjustments')) return 'Stock Adjustments';
    if (path.includes('/move-history')) return 'Move History';
    if (path.includes('/warehouses')) return 'Warehouses';
    if (path.includes('/profile')) return 'My Profile';
    return 'StockMaster';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6" data-testid="topbar">
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Space Grotesk' }}>
        {getPageTitle()}
      </h2>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKU, products..."
            data-testid="search-input"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          data-testid="notification-button"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-3" data-testid="user-dropdown">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;