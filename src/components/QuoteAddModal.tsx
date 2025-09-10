interface QuoteAddModalProps{
    modalOpen:boolean;
    setModalOpen:(val:any)=>void
}

const QuoteAddModal = ({setModalOpen, modalOpen}:QuoteAddModalProps) => {
    if(!modalOpen) return;
  return (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Quote </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              placeholder="Enter author"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote
            </label>
            <textarea
              placeholder="Enter quote"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
          </div>

          

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={()=>setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-secondary text-white "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuoteAddModal
