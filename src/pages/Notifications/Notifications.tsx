import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch, FiCheck } from "react-icons/fi";
import { fetchUsers, type User } from "../../services/usersServices";
import { addNotification } from "../../services/notificationServices";
import { supabase } from "../../lib/supabase";

const Notifications = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0 });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sendTo: "all" as "all" | "selected",
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const data = await fetchUsers();
    // Filter only users with FCM token
    const usersWithFCM = data.filter(user => user.fcm_token && user.fcm_token.trim() !== "");
    setUsers(usersWithFCM);
    setFilteredUsers(usersWithFCM);
    setIsLoading(false);
  };

  useEffect(() => {
    if (formData.sendTo === "selected") {
      const filtered = users.filter(user => {
        const name = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, formData.sendTo]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleSendNotification = async () => {
    setError(null);

    // Validation
    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required");
      return;
    }

    if (formData.sendTo === "selected" && selectedUsers.length === 0) {
      setError("Please select at least one user");
      return;
    }

    setIsSending(true);

    try {
      const recipientUsers = formData.sendTo === "all" ? users : users.filter(u => selectedUsers.includes(u.id));
      
      // Initialize progress
      setSendingProgress({ current: 0, total: recipientUsers.length });
      
      let successCount = 0;
      let failedCount = 0;
      const failedUsers: string[] = [];

      // Send FCM notification and create database record for each user
      for (let i = 0; i < recipientUsers.length; i++) {
        const user = recipientUsers[i];
        setSendingProgress({ current: i + 1, total: recipientUsers.length });
        try {
          // 1. Send FCM push notification via edge function
          const { data: fcmResult, error: fcmError } = await supabase.functions.invoke('send-fcm-notification', {
            body: {
              token: user.fcm_token,
              notification: {
                title: formData.title,
                body: formData.message,
              },
              data: {
                type: 'admin_push',
                title: formData.title,
                message: formData.message,
                timestamp: new Date().toISOString(),
              }
            }
          });

          if (fcmError) {
            console.error(`FCM error for user ${user.email}:`, fcmError);
            failedCount++;
            failedUsers.push(user.email);
            continue;
          }

          if (fcmResult && !fcmResult.success) {
            console.error(`FCM failed for user ${user.email}`);
            failedCount++;
            failedUsers.push(user.email);
            continue;
          }

          // 2. Store notification in database for in-app notification center
          await addNotification({
            user_id: user.id,
            actor_id: null,
            type: "admin_push",
            payload: {
              title: formData.title,
              message: formData.message,
            },
            status: "unseen",
          });

          successCount++;
        } catch (userError) {
          console.error(`Error sending to user ${user.email}:`, userError);
          failedCount++;
          failedUsers.push(user.email);
        }
      }

      // Show success modal with details
      if (successCount > 0) {
        let message = `Successfully sent notification to ${successCount} user${successCount !== 1 ? 's' : ''}!`;
        if (failedCount > 0) {
          message += ` (${failedCount} failed)`;
          console.log('Failed users:', failedUsers);
        }
        setSuccessMessage(message);
        setShowSuccessModal(true);

        // Reset form
        setFormData({ title: "", message: "", sendTo: "all" });
        setSelectedUsers([]);
        setSearchTerm("");
      } else {
        setError(`Failed to send notifications to all ${failedCount} user${failedCount !== 1 ? 's' : ''}. Please check console for details.`);
      }
    } catch (err) {
      setError("Failed to send notifications. Please try again.");
      console.error('General error:', err);
    } finally {
      setIsSending(false);
      setSendingProgress({ current: 0, total: 0 });
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header header={"Send Push Notifications"} link='' />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Push Notifications</h1>
          <p className="text-gray-600 text-lg">Send instant notifications to your users</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Create New Notification
            </h2>
            <p className="text-blue-100 mt-2">Compose and deliver your message to users</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start gap-3 animate-shake">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

          {/* Notification Form */}
          <div className="space-y-8">
            {/* Title Input */}
            <div className="relative">
              <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Notification Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Feature Update, Special Announcement..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm hover:border-gray-300"
                disabled={isSending}
              />
            </div>

            {/* Message Input */}
            <div className="relative">
              <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notification Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here... Make it engaging and informative!"
                rows={5}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm hover:border-gray-300 resize-none"
                disabled={isSending}
              />
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Keep it concise and actionable for better engagement
              </div>
            </div>

            {/* Send To Options */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
              <label className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Send To <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  formData.sendTo === "all" 
                    ? 'bg-white border-primary shadow-lg scale-105' 
                    : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="sendTo"
                    value="all"
                    checked={formData.sendTo === "all"}
                    onChange={(e) => {
                      setFormData({ ...formData, sendTo: e.target.value as "all" });
                      setSelectedUsers([]);
                      setSearchTerm("");
                    }}
                    className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
                    disabled={isSending}
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-bold">All Users</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {users.length}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Broadcast to everyone</p>
                  </div>
                  {formData.sendTo === "all" && (
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
                <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  formData.sendTo === "selected" 
                    ? 'bg-white border-primary shadow-lg scale-105' 
                    : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="sendTo"
                    value="selected"
                    checked={formData.sendTo === "selected"}
                    onChange={(e) => setFormData({ ...formData, sendTo: e.target.value as "selected" })}
                    className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
                    disabled={isSending}
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-gray-900 font-bold block">Select Specific Users</span>
                    <p className="text-xs text-gray-500 mt-1">Choose who receives it</p>
                  </div>
                  {formData.sendTo === "selected" && (
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-white/50 rounded-lg p-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Only users with valid FCM tokens will receive notifications. Currently <strong>{users.length} users</strong> are eligible.</p>
              </div>
            </div>

            {/* User Selection */}
            {formData.sendTo === "selected" && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6 shadow-inner animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Select Recipients
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Choose who will receive this notification</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllUsers}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
                      disabled={isSending}
                    >
                      ✓ Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllUsers}
                      className="px-4 py-2 text-sm bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-semibold"
                      disabled={isSending}
                    >
                      ✗ Clear All
                    </button>
                  </div>
                </div>

                {/* Search Users */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search by name or email..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm transition-all duration-200"
                    disabled={isSending}
                  />
                </div>

                {/* Selected Count */}
                <div className="mb-4 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Selected Recipients</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedUsers.length} <span className="text-sm font-normal text-gray-500">/ {filteredUsers.length}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="text-lg font-bold text-primary">{filteredUsers.length > 0 ? Math.round((selectedUsers.length / filteredUsers.length) * 100) : 0}%</p>
                  </div>
                </div>

                {/* User List */}
                <div className="max-h-[500px] overflow-y-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
                  {isLoading ? (
                    <div className="p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-500 font-medium">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => {
                        const userName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
                        const isSelected = selectedUsers.includes(user.id);
                        
                        return (
                          <label
                            key={user.id}
                            className={`flex items-center p-4 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-primary' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleUserSelection(user.id)}
                                className="w-6 h-6 text-primary rounded-lg focus:ring-2 focus:ring-primary border-2 border-gray-300"
                                disabled={isSending}
                              />
                              {isSelected && (
                                <FiCheck className="absolute top-1 left-1 text-white w-4 h-4 pointer-events-none" />
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{userName}</span>
                                {user.is_online && (
                                  <span className="w-2 h-2 bg-green-500 rounded-full" title="Online"></span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.is_premium && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full shadow-sm">
                                  ⭐ Premium
                                </span>
                              )}
                              {isSelected && (
                                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="flex justify-end pt-6 border-t-2 border-gray-100">
              <button
                onClick={handleSendNotification}
                disabled={isSending}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isSending ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">
                      {sendingProgress.total > 0 
                        ? `Sending ${sendingProgress.current}/${sendingProgress.total}...` 
                        : 'Sending Notifications...'}
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="relative z-10">Send Notification</span>
                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform scale-100 animate-scaleIn">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-lg animate-bounce">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Success!</h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">{successMessage}</p>
              <button
                onClick={closeSuccessModal}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Awesome, Done!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Notifications;
