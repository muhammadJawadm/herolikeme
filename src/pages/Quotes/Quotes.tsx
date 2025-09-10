import { useState } from "react";
import QuoteAddModal from "../../components/QuoteAddModal";
import Header from "../../layouts/partials/Header"
import { FiSearch } from "react-icons/fi";
const Quotes = () => {
    const[modalOpen,setModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
      const quotes = [
    {
      id: 1,
      author: "Albert Einstein",
      text: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
      category: "Inspirational",
      status: "Approved",
    },
    {
      id: 2,
      author: "Oscar Wilde",
      text: "Be yourself; everyone else is already taken.",
      category: "Philosophy",
      status: "Pending",
    },
    {
      id: 3,
      author: "Maya Angelou",
      text: "You will face many defeats in life, but never let yourself be defeated.",
      category: "Motivational",
      status: "Rejected",
    },
  ];

  return (
   <div>
      <Header header={"Manage Quotes"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                             <div className="relative w-full sm:w-96">
                               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <FiSearch className="text-gray-400" />
                               </div>
                               <input
                                 type="text"
                                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                                 placeholder="Search quotes..."
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                               />
                             </div>
                               <button
          onClick={()=>setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-secondary text-white cursor-pointer">
            + Add Quote
          </button>
       </div>
        
        <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
          <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
            <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Quote</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {quotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="px-6 py-4">{quote.author}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{quote.text}</td>
                  <td className="px-6 py-4">{quote.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        quote.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : quote.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    {modalOpen && <QuoteAddModal setModalOpen={setModalOpen} modalOpen={modalOpen} /> }
     
    </div>
  )
}

export default Quotes
