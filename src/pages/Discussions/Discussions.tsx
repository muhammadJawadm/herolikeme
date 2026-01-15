import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import {
  fetchCommunities,
  deleteCommunity,
  addCommunity,
  updateCommunity,
  type Community
} from "../../services/communityServices";
import { fetchCategories, type CategoryGroup } from "../../services/categoryServices";

const Discussions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "admin" | "user">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    catagory_id: 1,
    is_heroz: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCommunities = async () => {
    const data = await fetchCommunities();
    setCommunities(data);
  };

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    refreshCommunities();
    loadCategories();
  }, []);

  const getCategoryTitle = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : `Category ${categoryId}`;
  };

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedCommunity(null);
    setFormData({
      title: "",
      description: "",
      catagory_id: categories.length > 0 ? categories[0].id : 1,
      is_heroz: true,
    });
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (community: Community) => {
    setIsEdit(true);
    setSelectedCommunity(community);
    setFormData({
      title: community.title,
      description: community.description,
      catagory_id: community.catagory_id,
      is_heroz: true,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && selectedCommunity) {
        const result = await updateCommunity(selectedCommunity.id, formData);
        if (result) {
          await refreshCommunities();
          setShowModal(false);
        } else {
          setError("Failed to update community");
        }
      } else {
        const result = await addCommunity(formData);
        if (result) {
          await refreshCommunities();
          setShowModal(false);
        } else {
          setError("Failed to add community");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this community?")) {
      const success = await deleteCommunity(id);
      if (success) {
        await refreshCommunities();
      }
    }
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") {
      return matchesSearch;
    } else if (filterType === "admin") {
      return matchesSearch && community.is_heroz === true;
    } else {
      return matchesSearch && community.is_heroz === false;
    }
  });
  return (
    <div>
      <Header header={"Manage Communities"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <span>
                  {filterType === "all" ? "All" : filterType === "admin" ? "Admin Communities" : "User Communities"}
                </span>
                <FiChevronDown className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setFilterType("all");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filterType === "all" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("admin");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filterType === "admin" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                      >
                        Admin Communities
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("user");
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${filterType === "user" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                      >
                        User Communities
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg shadow hover:bg-secondary/90 transition-colors"
            >
              + Add Community
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Created At</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {filteredCommunities.length > 0 ? (
                  filteredCommunities.map((community) => (
                    <tr key={community.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-gray-700 font-medium">{community.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {community.title}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="line-clamp-2 text-gray-700">{community.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getCategoryTitle(community.catagory_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(community.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEditModal(community)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => !community.is_heroz && handleDelete(community.id)}
                          disabled={!community.is_heroz}
                          title={!community.is_heroz ? "Admin can't delete the user Communities" : ""}
                          className={`font-medium ${!community.is_heroz
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800 cursor-pointer hover:underline"
                            }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No communities found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update Community" : "Add Community"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter community title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter community description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.catagory_id}
                  onChange={(e) => setFormData({ ...formData, catagory_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Discussions
