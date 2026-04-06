
import InputField from "./InputField";

interface PlanProps {
  id: string,
  plan_id: string,
  plan_name: string,
  price: number,
  currency: string,
  duration_months: number,
  product_id: string,
  entitlement_id: string,
  is_active: boolean
}

interface SubscriptionModalProps{
    isEditMode:boolean, 
    currentPlan?: PlanProps | null;
    handleSubmit : (e: React.FormEvent) => void;
    setIsModalOpen: (modalOpen : boolean) => void;
}

const SubscriptionModal = ({isEditMode, currentPlan, handleSubmit, setIsModalOpen}:SubscriptionModalProps) => {
  return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputField labelText="Plan ID (Unique)" type="text"
                      name="plan_id"
                      required
                      defaultValue={currentPlan?.plan_id || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                  </div>
                  <div>
                    <InputField labelText="Plan Name" type="text"
                      name="name"
                      required
                      defaultValue={currentPlan?.plan_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                  </div>
                  <div>
                    <InputField type="number"
                      name="price"
                      required
                      step="0.01"
                      defaultValue={currentPlan?.price || ''}
                      labelText="Price"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                  </div>
                  <div>
                    <InputField labelText="Currency" type="text"
                      name="currency"
                      defaultValue={currentPlan?.currency || 'USD'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                  </div>
                  <div>
                    <InputField
                      labelText="Duration (Months)"
                      type="number"
                      required
                      name="duration_months"
                      defaultValue={currentPlan?.duration_months || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                     />
                  </div>
                  <div>
                    <InputField
                      labelText="Product ID"
                      type="text"
                      required
                      name="product_id"
                      defaultValue={currentPlan?.product_id || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                     />
                  </div>
                  <div>
                    <InputField
                      labelText="Entitlement ID"
                      type="text"
                      required
                      name="entitlement_id"
                      defaultValue={currentPlan?.entitlement_id || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                     />
                  </div>
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      defaultChecked={isEditMode ? currentPlan?.is_active : true}
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
                    className="px-4 py-2 rounded-lg bg-secondary text-white"
                  >
                    {isEditMode ? 'Update Plan' : 'Add Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
  )
}

export default SubscriptionModal
