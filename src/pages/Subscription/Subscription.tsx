
import { useState, useEffect } from 'react';
import Header from '../../layouts/partials/Header';
import { FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import SubscriptionModal from '../../components/SubscriptionModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

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

const Subscription = () => {
  const [plans, setPlans] = useState<PlanProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanProps | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subscription_plans').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching plans:', error);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const filteredPlans = plans.filter(plan =>
    plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.plan_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlanStatus = async (plan: PlanProps) => {
    const { error } = await supabase
      .from('subscription_plans')
      .update({ is_active: !plan.is_active })
      .eq('id', plan.id);
    if (!error) {
       setPlans(plans.map(p =>
         p.id === plan.id ? { ...p, is_active: !p.is_active } : p
       ));
    } else {
       alert(error.message);
    }
  };

  const deletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      const { error } = await supabase.from('subscription_plans').delete().eq('id', id);
      if (!error) {
        setPlans(plans.filter(plan => plan.id !== id));
      } else {
        alert(error.message);
      }
    }
  };

  const editPlan = (plan: PlanProps) => {
    setCurrentPlan(plan);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const addNewPlan = () => {
    setCurrentPlan(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const planData = {
      plan_id: formData.get('plan_id') as string,
      plan_name: formData.get('name') as string,
      price: Number(formData.get('price')),
      currency: (formData.get('currency') as string) || 'USD',
      duration_months: Number(formData.get('duration_months')),
      product_id: formData.get('product_id') as string,
      entitlement_id: formData.get('entitlement_id') as string,
      is_active: formData.get('isActive') === 'on'
    };

    if (isEditMode && currentPlan) {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(planData)
        .eq('id', currentPlan.id)
        .select()
        .single();
        
      if (!error && data) {
         setPlans(plans.map(plan => plan.id === data.id ? data : plan));
         setIsModalOpen(false);
      } else {
        alert(error?.message || "Failed to update");
      }
    } else {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert([planData])
        .select()
        .single();

      if (!error && data) {
        setPlans([data, ...plans]);
        setIsModalOpen(false);
      } else {
        alert(error?.message || "Failed to create: Maybe plan_id is not unique?");
      }
    }
  };

  return (
    <div>
      <Header header={"Subscriptions"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                placeholder="Search plan name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="">
              <button
                onClick={addNewPlan}
                className="px-4 py-2 rounded-lg bg-secondary text-white cursor-pointer">
                + Add New Plan
              </button>

            </div>
          </div>

          <div className="my-3">
            {loading ? (
               <div className="text-center py-10 text-gray-500">Loading plans...</div>
            ) : filteredPlans.length === 0 ? (
               <div className="text-center py-10 text-gray-500">No plans found.</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className={`p-6 flex-1 ${plan.is_active ? 'bg-gradient-to-r from-primary/40 to-primary/20' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">{plan.plan_name}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editPlan(plan)}
                          className="text-primary p-1 cursor-pointer"
                          title="Edit"
                        ><FaEdit />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                          title="Delete"
                        ><FaTrash />
                        </button>
                        <button
                          onClick={() => togglePlanStatus(plan)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title={plan.is_active ? "Deactivate" : "Activate"}
                        >
                          {plan.is_active ? <FiToggleRight className="text-green-500" /> : <FiToggleLeft className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 font-mono bg-white/50 inline-block px-2 py-1 rounded">ID: {plan.plan_id}</div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.currency === 'USD' ? '$' : plan.currency}{plan.price}</span>
                      <span className="text-gray-600 ml-1">/ {plan.duration_months} Months</span>
                    </div>
                    <div className={`mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Associations:</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Product:</span>
                          <span className="text-gray-800 font-mono">{plan.product_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Entitlement:</span>
                          <span className="text-gray-800 font-mono">{plan.entitlement_id || 'N/A'}</span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SubscriptionModal setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} isEditMode={isEditMode} currentPlan={currentPlan} />
      )}
    </div>
  )
}

export default Subscription