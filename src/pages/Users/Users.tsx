import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Header from "../../layouts/partials/Header";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import { fetchUsers } from '../../services/usersServices'
import type { User } from '../../services/usersServices'

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Fetch ALL USERS
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsersData(data);
      setIsLoading(false);
    };
    getUsers();
  }, []);

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.first_name?.toLowerCase().includes(search) ||
        user.last_name?.toLowerCase().includes(search)
      );
    });
  }, [usersData, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <Header header={"Manage Users"} link='' />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">

        {/* Search and Info Bar */}
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={200}>200 per page</option>
            </select>
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
                  <th className="px-6 py-3">Status</th>
                  {/* <th className="px-6 py-3">Last Seen</th> */}
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200/60">
                {paginatedUsers.map((user) => (
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_premium
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_profile_complete
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {user.is_profile_complete ? "Complete" : "Incomplete"}
                      </span>
                    </td>

                    {/* Online Status */}
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_online
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
