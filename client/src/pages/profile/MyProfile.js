import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in" data-testid="my-profile-page">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div className="max-w-3xl">
        <div className="card">
          {/* Profile Header */}
          <div className="flex items-center pb-6 border-b border-gray-200 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk' }}>{user?.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-start">
              <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                <p className="text-base text-gray-900">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                <p className="text-base text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Shield className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
                <p className="text-base text-gray-900">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This is a demo application. Profile editing features would be available in a production version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;