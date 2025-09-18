import { useState } from "react";

interface NotificationModelProps{
    editingNotification:any;
    closeModal:()=>void;
    handleSave:()=>void;
}

const NotificationModel = ({editingNotification, closeModal, handleSave}:NotificationModelProps) => {
    const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const [formData, setFormData] = useState({
    title: editingNotification?.title || "",
    message: editingNotification?.message || "",
    status: editingNotification?.status || "Active",
    userId: editingNotification?.userId || users[0].id,
  });

  const onSave = () => {
    handleSave();
    closeModal();
  };
  return (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {editingNotification ? "Edit Notification" : "Add Notification"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Send To (User)</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.userId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  userId: Number(e.target.value),
                }))
              }
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModel
