import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, TruckIcon, ArrowLeftRight, ClipboardCheck, History, Settings, User, LogOut, Warehouse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [operationsOpen, setOperationsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
  ];

  const operationItems = [
    { path: '/operations/receipts', icon: FileText, label: 'Receipts' },
    { path: '/operations/deliveries', icon: TruckIcon, label: 'Deliveries' },
    { path: '/operations/transfers', icon: ArrowLeftRight, label: 'Internal Transfers' },
    { path: '/operations/adjustments', icon: ClipboardCheck, label: 'Adjustments' },
    { path: '/operations/move-history', icon: History, label: 'Move History' },
  ];

  const settingItems = [
    { path: '/settings/warehouses', icon: Warehouse, label: 'Warehouses' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col" data-testid="sidebar">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-cyan-600" style={{ fontFamily: 'Space Grotesk' }}>StockMaster</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                  isActive(item.path)
                    ? 'bg-cyan-50 text-cyan-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}

          {/* Operations Section */}
          <div className="pt-4">
            <button
              onClick={() => setOperationsOpen(!operationsOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              data-testid="operations-toggle"
            >
              <span>Operations</span>
              <span className={`transform transition-transform ${operationsOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {operationsOpen && (
              <div className="space-y-1 mt-1">
                {operationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                        isActive(item.path)
                          ? 'bg-cyan-50 text-cyan-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              data-testid="settings-toggle"
            >
              <span>Settings</span>
              <span className={`transform transition-transform ${settingsOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {settingsOpen && (
              <div className="space-y-1 mt-1">
                {settingItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                        isActive(item.path)
                          ? 'bg-cyan-50 text-cyan-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          <Link
            to="/profile"
            data-testid="nav-profile"
            className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <User className="w-5 h-5 mr-3" />
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;