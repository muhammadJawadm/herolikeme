import { useState } from "react";
import Header from "../../layouts/partials/Header"
import { FiSearch } from "react-icons/fi";

interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}
const feedbackData: FeedbackItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    message: "Great platform! Very easy to use.",
    date: "2025-09-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    message: "I love the new features added last week.",
    date: "2025-09-05",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    message: "Found a few bugs but overall experience is good.",
    date: "2025-09-08",
  },
];
const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
     <div>
      <Header header={"Manage Feedback"} link="" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
  <div className="relative w-full sm:w-96">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiSearch className="text-gray-400" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
      placeholder="Search feedback..."
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
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200/60">
              {feedbackData.map((feedback) => (
                <tr
                  key={feedback.id}
                >
                 <td className="px-6 py-4">{feedback.name}</td>
                 <td className="px-6 py-4">{feedback.email}</td>
                  <td className="px-6 py-4">{feedback.message}</td>
                  <td className="px-6 py-4">{feedback.date}</td>
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

export default Feedback
