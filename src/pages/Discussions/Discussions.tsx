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
const discussionsData: DiscussionItem[] = [
  {
    id: 1,
    title: "Happiness is free",
    description:
      "Happiness is free , always stay happy",
    category: "happy",
     user: "Jane Smith",
  },
  {
    id: 2,
   title: "Happiness is free",
    description:
      "Happiness is free , always stay happy",
    category: "happy",
     user: "John Doe",
  },
  {
    id: 3,
  title: "Happiness is free",
    description:
      "Happiness is free , always stay happy",
    category: "happy",
     user: "Michael Johnson",
  },
];
const Discussions = () => {
   const [searchTerm, setSearchTerm] = useState("");
  return (
  <div>
      <Header header={"Manage Discussions"} link="" />
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
                                   
                                 </div>
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
                {discussionsData.map((discussion) => (
                  <tr key={discussion.id}>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {discussion.title}
                    </td>
                    <td className="px-6 py-4">{discussion.description}</td>
                    <td className="px-6 py-4">{discussion.category}</td>
                    <td className="px-6 py-4">{discussion.user}</td>
                    <td className="px-4 py-3 text-center">
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
    </div>
  )
}

export default Discussions
