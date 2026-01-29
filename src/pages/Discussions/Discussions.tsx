import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import {
  fetchCommunities,
  deleteCommunity,
  addCommunity,
  updateCommunity,
  type Community
} from "../../services/communityServices";
import { fetchCategories, type CategoryGroup } from "../../services/categoryServices";
import {
  fetchCommunityMessages,
  deleteMessage,
  type CommunityMessage
} from "../../services/communityMessagesServices";

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
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedCommunityForMessages, setSelectedCommunityForMessages] = useState<Community | null>(null);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

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
    if (window.confirm("Are you sure you want to delete this community? All messages will also be deleted due to cascade delete.")) {
      const success = await deleteCommunity(id);
      if (success) {
        await refreshCommunities();
      }
    }
  };

  const openMessagesModal = async (community: Community) => {
    setSelectedCommunityForMessages(community);
    setShowMessagesModal(true);
    setLoadingMessages(true);
    const communityMessages = await fetchCommunityMessages(community.id);
    setMessages(communityMessages);
    setLoadingMessages(false);
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const success = await deleteMessage(messageId);
      if (success && selectedCommunityForMessages) {
        // Refresh messages
        const communityMessages = await fetchCommunityMessages(selectedCommunityForMessages.id);
        setMessages(communityMessages);
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
                    <tr 
                      key={community.id} 
                      className="bg-white hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => openMessagesModal(community)}
                    >
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
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditModal(community)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(community.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer hover:underline font-medium"
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

      {/* Messages Modal */}
      {showMessagesModal && selectedCommunityForMessages && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Community Messages
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCommunityForMessages.title}
                </p>
              </div>
              <button
                onClick={() => setShowMessagesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {msg.sender_name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {msg.sender_name || "Unknown User"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {msg.sender_email}
                              </p>
                            </div>
                          </div>
                          <div className="ml-11">
                            <p className="text-gray-700 mb-2">{msg.message}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-200 rounded">
                                {msg.message_type}
                              </span>
                              <span>
                                {new Date(msg.created_at).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete message"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">This community doesn't have any messages.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Total Messages: <span className="font-medium text-gray-800">{messages.length}</span>
                </p>
                <button
                  onClick={() => setShowMessagesModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Discussions
