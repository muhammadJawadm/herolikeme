import { useEffect, useState } from "react";
import QuoteAddModal from "../../components/QuoteAddModal";
import QuoteDeleteModal from "../../components/QuoteDeleteModal";
import Header from "../../layouts/partials/Header"
import { FiSearch } from "react-icons/fi";
import type { Quote } from "../../services/quoteServices";
import { fetchQuotes } from "../../services/quoteServices";
// import { fetchCategories, type CategoryGroup } from "../../services/categoryServices";

const Quotes = () => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [selectedQuoteData, setSelectedQuoteData] = useState<Quote | undefined>();
    const [searchTerm, setSearchTerm] = useState("");
    
    const [quotes, setQuotes] = useState<Quote[]>([]);

    const refreshQuotes = async () => {
      const data = await fetchQuotes();
      setQuotes(data);
    };

    
    const openDeleteModal = (quoteId: number) => {
      setDeleteModalOpen(true);
      setSelectedQuoteId(quoteId);
    };

    const openEditModal = (quote: Quote) => {
      setEditModalOpen(true);
      setSelectedQuoteData(quote);
    };

    useEffect(() => {
      refreshQuotes();
    }, [])

const filterQuotes = quotes.filter((quote) =>{
  if(!searchTerm) return true;
  const search = searchTerm.toLowerCase();
  return (
   quote.text.toLowerCase().includes(search)||
   quote.author.toLowerCase().includes(search)
)
});
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
          onClick={()=>setAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-secondary text-white cursor-pointer">
            + Add Quote
          </button>
       </div>
        
        <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
          <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
            <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Quote</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60">
              {filterQuotes.map((quote) => (
                <tr key={quote.id} className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="px-6 py-4 text-gray-700 font-medium">{quote.id}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{quote.author}</td>
                  <td className="px-6 py-4 max-w-md">
                    <p className="line-clamp-2 text-gray-700">{quote.text}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {quote.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(quote.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={()=>openEditModal(quote)} className="text-blue-600 hover:text-blue-800 hover:underline mr-3 font-medium">
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal(quote.id)}
                      className="text-red-600 hover:text-red-800 hover:underline font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    {addModalOpen && (
      <QuoteAddModal 
        setModalOpen={setAddModalOpen} 
        modalOpen={addModalOpen} 
        isUpdate={false}
        refreshQuotes={refreshQuotes}
      /> 
    )}

    {editModalOpen && (
      <QuoteAddModal 
        setModalOpen={setEditModalOpen} 
        modalOpen={editModalOpen} 
        isUpdate={true}
        quoteData={selectedQuoteData}
        refreshQuotes={refreshQuotes}
      /> 
    )}

    {deleteModalOpen && (
      <QuoteDeleteModal 
        setModalOpen={setDeleteModalOpen} 
        modalOpen={deleteModalOpen} 
        quoteId={selectedQuoteId} 
        refreshQuotes={refreshQuotes}
      /> 
    )}
              
    </div>
  )
}

export default Quotes
