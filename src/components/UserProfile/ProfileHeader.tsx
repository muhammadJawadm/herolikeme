import React from 'react';
import type { User } from '../../services/usersServices';

interface ProfileHeaderProps {
  user: User | undefined;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={user?.profile_images ? user.profile_images[0] : ''}
            alt={user?.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute bottom-2 right-2">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                user?.is_online ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {user?.is_online ? '✓' : '✗'}
            </span>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600 mt-1">{user?.email}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.is_online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {user?.is_online ? 'Online' : 'Offline'}
            </span>

            {user?.is_premium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                Premium Member
              </span>
            )}

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user?.is_profile_complete
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {user?.is_profile_complete ? 'Profile Complete' : 'Profile Incomplete'}
            </span>

            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {user?.age_range || 'N/A'}
            </span>

            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {user?.gender || 'N/A'}
            </span>

            {user?.is_paused && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Account Paused
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
