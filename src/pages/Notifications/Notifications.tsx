import { useState } from "react";
import NotificationModel from "../../components/NotificationModel";
import Header from "../../layouts/partials/Header";
import { FiSearch } from "react-icons/fi";


interface Notification {
  id: number;
  title: string;
  message: string;
  status: string;
}
const Notifications = () => {
     const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "System Update", message: "The system will reboot at 2 AM", status: "Active" },
    { id: 2, title: "Meeting Reminder", message: "Team meeting at 10 AM", status: "Inactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
 

  // Open modal for add or edit
  const openModal = (notification?: Notification) => {
    if (notification) {
      setEditingNotification(notification);
      
    } else {
      setEditingNotification(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotification(null);
  };

  // Save notification (add or edit)
  const handleSave = () => {
    
    closeModal();
  };

  // Delete notification
  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Filtered notifications
  const filtered = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
   <div>
      <Header header={"Manage Notifications"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
      
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                   <div className="relative w-full sm:w-96">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <FiSearch className="text-gray-400" />
                     </div>
                     <input
                       type="text"
                       className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                       placeholder="Search notifications..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                   </div>
                    <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-primary cursor-pointer text-white rounded-lg "
        >
          + Add Notification
        </button>
                 </div>
       <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
         <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
         <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-gray-200/60">
            {filtered.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{n.title}</td>
                <td className="px-6 py-3">{n.message}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      n.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {n.status}
                  </span>
                </td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => openModal(n)}
                    className="px-3 py-1 text-sm rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
</div>
      {isModalOpen && (
        <NotificationModel editingNotification={editingNotification} closeModal={closeModal} handleSave={handleSave} />
      )}
    </div>
    </div>
  )
}

export default Notifications
