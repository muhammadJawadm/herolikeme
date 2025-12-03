import { useState, useEffect } from "react";
import { addNotification, updateNotification, type Notification } from "../services/notificationServices";
import { fetchUsers } from "../services/usersServices";

interface NotificationModelProps {
  editingNotification: Notification | null;
  closeModal: () => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationModel = ({
  editingNotification,
  closeModal,
  refreshNotifications
}: NotificationModelProps) => {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    user_id: "",
    actor_id: "",
    type: "",
    title: "",
    message: "",
    status: "unseen" as string,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      const userData = await fetchUsers();
      setUsers(userData.map(u => ({ id: u.id, name: u.name || u.email })));
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (editingNotification) {
      setFormData({
        user_id: editingNotification.user_id,
        actor_id: editingNotification.actor_id || "",
        type: editingNotification.type,
        title: editingNotification.payload?.title || "",
        message: editingNotification.payload?.message || "",
        status: editingNotification.status,
      });
    }
  }, [editingNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.user_id || !formData.type || !formData.title) {
      setError("User, type, and title are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
      };

      if (editingNotification) {
        // Update existing notification
        const result = await updateNotification(editingNotification.id, {
          user_id: formData.user_id,
          actor_id: formData.actor_id || null,
          type: formData.type,
          payload: payload,
          status: formData.status,
        });

        if (result) {
          await refreshNotifications();
          closeModal();
        } else {
          setError("Failed to update notification");
        }
      } else {
        // Add new notification
        const result = await addNotification({
          user_id: formData.user_id,
          actor_id: formData.actor_id || null,
          type: formData.type,
          payload: payload,
          status: formData.status,
        });

        if (result) {
          await refreshNotifications();
          closeModal();
        } else {
          setError("Failed to add notification");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingNotification ? "View/Update Notification" : "Add Notification"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Send To User <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.user_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, user_id: e.target.value }))
              }
              disabled={isSubmitting}
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actor ID (Optional)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.actor_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actor_id: e.target.value }))
              }
              disabled={isSubmitting}
            >
              <option value="">None</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              placeholder="e.g., match, message, like"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Notification title"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Notification message"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              disabled={isSubmitting}
            >
              <option value="unseen">Unseen</option>
              <option value="seen">Seen</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : editingNotification ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationModel;
