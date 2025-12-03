import { deleteQuoteById } from "../services/quoteServices";

interface QuoteDeleteModalProps{
    modalOpen:boolean;
    setModalOpen:(val:any)=>void;
    quoteId:number | null;
    refreshQuotes: () => Promise<void>;
}
const QuoteDeleteModal = ({setModalOpen, modalOpen, quoteId, refreshQuotes }:QuoteDeleteModalProps) => {
    if(!modalOpen) return; 
    const handleDelete = async()=>{
        if(quoteId === null) return;
        const success = await deleteQuoteById(quoteId); 
        if(success){
            await refreshQuotes();
            setModalOpen(false);   
        }
    }
    return(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Delete Quote</h2>        
        <p className="text-gray-600 mb-4">Are you sure you want to delete this quote?</p>
        <div className="flex justify-end gap-4">
            <button 
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    )
}
export default QuoteDeleteModal;