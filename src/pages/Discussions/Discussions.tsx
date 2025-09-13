import { useState } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch } from "react-icons/fi";

interface DiscussionItem {
  id: number;
  title: string;
  description: string;
  category: string;
   user: string;
}
const Discussions = () => {
    const [searchTerm, setSearchTerm] = useState("");
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([
    {
      id: 1,
      title: "Happiness is free",
      description: "Happiness is free , always stay happy",
      category: "happy",
      user: "Jane Smith",
    },
    {
      id: 2,
      title: "Happiness is free",
      description: "Happiness is free , always stay happy",
      category: "happy",
      user: "John Doe",
    },
    {
      id: 3,
      title: "Happiness is free",
      description: "Happiness is free , always stay happy",
      category: "happy",
      user: "Michael Johnson",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
    category: "",
    user: "",
  });

  const handleAddDiscussion = () => {
    if (
      newDiscussion.title &&
      newDiscussion.description &&
      newDiscussion.category &&
      newDiscussion.user
    ) {
      const newItem: DiscussionItem = {
        id: discussions.length + 1,
        ...newDiscussion,
      };
      setDiscussions([...discussions, newItem]);
      setNewDiscussion({ title: "", description: "", category: "", user: "" });
      setShowModal(false);
    }
  };
  return (
  <div>
      <Header header={"Manage Discussions"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search discussion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Discussion Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg shadow"
          >
            + Add Discussion
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {discussions.map((discussion) => (
                  <tr key={discussion.id}>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {discussion.title}
                    </td>
                    <td className="px-6 py-4">{discussion.description}</td>
                    <td className="px-6 py-4">{discussion.category}</td>
                    <td className="px-6 py-4">{discussion.user}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 cursor-pointer hover:underline mr-3">
                      Edit
                    </button> 
                      <button className="text-red-500 cursor-pointer hover:text-red-700 font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Discussion</h2>

            <input
              type="text"
              placeholder="Title"
              value={newDiscussion.title}
              onChange={(e) =>
                setNewDiscussion({ ...newDiscussion, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newDiscussion.description}
              onChange={(e) =>
                setNewDiscussion({
                  ...newDiscussion,
                  description: e.target.value,
                })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Category"
              value={newDiscussion.category}
              onChange={(e) =>
                setNewDiscussion({ ...newDiscussion, category: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="User"
              value={newDiscussion.user}
              onChange={(e) =>
                setNewDiscussion({ ...newDiscussion, user: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDiscussion}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Discussions
