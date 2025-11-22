import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import CreateProduct from './pages/products/CreateProduct';
import UpdateProduct from './pages/products/UpdateProduct';
import ProductDetails from './pages/products/ProductDetails';
import StockAvailability from './pages/products/StockAvailability';
import ReceiptList from './pages/operations/ReceiptList';
import CreateReceipt from './pages/operations/CreateReceipt';
import DeliveryList from './pages/operations/DeliveryList';
import CreateDelivery from './pages/operations/CreateDelivery';
import TransferList from './pages/operations/TransferList';
import CreateTransfer from './pages/operations/CreateTransfer';
import AdjustmentList from './pages/operations/AdjustmentList';
import CreateAdjustment from './pages/operations/CreateAdjustment';
import MoveHistory from './pages/operations/MoveHistory';
import WarehouseList from './pages/settings/WarehouseList';
import CreateWarehouse from './pages/settings/CreateWarehouse';
import WarehouseDetails from './pages/settings/WarehouseDetails';
import MyProfile from './pages/profile/MyProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/products/:id/edit" element={<UpdateProduct />} />
              <Route path="/products/stock-availability" element={<StockAvailability />} />
              
              <Route path="/operations/receipts" element={<ReceiptList />} />
              <Route path="/operations/receipts/create" element={<CreateReceipt />} />
              <Route path="/operations/deliveries" element={<DeliveryList />} />
              <Route path="/operations/deliveries/create" element={<CreateDelivery />} />
              <Route path="/operations/transfers" element={<TransferList />} />
              <Route path="/operations/transfers/create" element={<CreateTransfer />} />
              <Route path="/operations/adjustments" element={<AdjustmentList />} />
              <Route path="/operations/adjustments/create" element={<CreateAdjustment />} />
              <Route path="/operations/move-history" element={<MoveHistory />} />
              
              <Route path="/settings/warehouses" element={<WarehouseList />} />
              <Route path="/settings/warehouses/create" element={<CreateWarehouse />} />
              <Route path="/settings/warehouses/:id" element={<WarehouseDetails />} />
              
              <Route path="/profile" element={<MyProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;