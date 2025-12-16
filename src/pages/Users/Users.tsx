import { FiSearch } from "react-icons/fi";
import Header from "../../layouts/partials/Header";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { fetchUsers } from '../../services/usersServices'
import type { User } from '../../services/usersServices'

import { fetchSelfieVerificationByUserId } from "../../services/selfieVerificationServices";
import type { SelfieVerification } from "../../services/selfieVerificationServices";

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState<(User & { selfieStatus?: string })[]>([]);

  // Fetch ALL USERS
  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      console.log("Fetched users:", data);

      setUsersData(data);
    };
    getUsers();
  }, []);

  // Fetch Selfie Verification for every user
  useEffect(() => {
    if (usersData.length === 0) return;

    const fetchAllSelfieStatus = async () => {
      const updated = await Promise.all(
        usersData.map(async (user) => {
          let selfie: SelfieVerification | null = null;

          try {
            selfie = await fetchSelfieVerificationByUserId(user.id);
            console.log("Fetched selfie:", selfie);
          } catch (err) {
            console.error("Error fetching selfie:", err);
          }

          return {
            ...user,
            selfieStatus: selfie?.status || "Not Uploaded",
          };
        })
      );

      setUsersData(updated);
    };

    fetchAllSelfieStatus();
  }, [usersData.length]);

  const filteredUsers = usersData.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.first_name?.toLowerCase().includes(search) ||
      user.last_name?.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <Header header={"Manage Users"} link='' />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">

        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Gender</th>
                  <th className="px-6 py-3">Age Range</th>
                  <th className="px-6 py-3">Premium</th>
                  <th className="px-6 py-3">Profile</th>

                  {/* NEW COLUMN */}
                  <th className="px-6 py-3">Selfie Status</th>

                  <th className="px-6 py-3">Status</th>
                  {/* <th className="px-6 py-3">Last Seen</th> */}
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/60">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.user_profiles?.profile_images && user.user_profiles?.profile_images.length > 0 ? user.user_profiles.profile_images[0] : '/placeholder-avatar.png'}
                          alt="User"
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                        />
                        <span className="font-medium text-gray-800">
                          {user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-3 py-1">{user.user_profiles?.gender || "N/A"}</td>
                    <td className="px-3 py-2">{user.user_profiles?.age_range || "N/A"}</td>

                    {/* Premium Badge */}
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_premium
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.is_premium ? "Premium" : "Free"}
                      </span>
                    </td>

                    {/* Profile Status */}
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_profile_complete
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {user.is_profile_complete ? "Complete" : "Incomplete"}
                      </span>
                    </td>

                    {/* SELFIE STATUS COLUMN */}
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.selfieStatus === "Approved"
                            ? "bg-green-100 text-green-800"
                            : user.selfieStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.selfieStatus}
                      </span>
                    </td>

                    {/* Online Status */}
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_online
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_online ? "Online" : "Offline"}
                      </span>
                    </td>

                    {/* <td className="px-6 py-3 text-gray-700">
                      {user.last_seen ? new Date(user.last_seen).toLocaleDateString() : "N/A"}
                    </td> */}

                    <td className="px-6 py-3">
                      <Link
                        to={`/users/${user.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
