
import InputField from "./InputField";

interface SubscriptionModalProps{
    isEditMode:boolean, 
    handleSubmit : (e: React.FormEvent) => void;
    setIsModalOpen: (modalOpen : boolean) => void;
}

const SubscriptionModal = ({isEditMode, handleSubmit, setIsModalOpen}:SubscriptionModalProps) => {
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    
                    <InputField  labelText="Plan Name" type="text"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                  </div>
                  <div>
                    <InputField  type="number"
                      name="price"
                      labelText="Price ($)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                   
                  </div>
                  <div>
                    <InputField
                    labelText="Duration"
                    type="text"
                      name="duration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., 1 Month, 1 Year, Forever"
                     />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Features (comma separated)</label>
                    <textarea
                      name="features"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                      placeholder="e.g., Basic listing, Limited photos, Basic support"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                     
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-gray-700">Active Plan</label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  

                           <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-secondary text-white "
            >
              Add Plan
            </button>
                </div>
              </form>
            </div>
          </div>
        </div>
  )
}

export default SubscriptionModal
