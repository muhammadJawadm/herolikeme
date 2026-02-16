
import { useState } from 'react';
import Header from '../../layouts/partials/Header';
import { FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import SubscriptionModal from '../../components/SubscriptionModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
interface PlanProps {
  id: number,
  name: string,
  price: number,
  duration: string,
  features: string[],
  isActive: boolean
}
const Subscription = () => {

  const initialPlans: PlanProps[] = [
    {
      id: 1,
      name: "Basic",
      price: 0,
      duration: "Forever",
      features: ["Basic listing", "Limited photos", "Basic support"],
      isActive: true
    },
    {
      id: 2,
      name: "Monthly",
      price: 30,
      duration: "1 Month",
      features: ["Enhanced listing", "10 photos", "Priority support", "Analytics"],
      isActive: true
    },
    {
      id: 3,
      name: "Yearly",
      price: 300,
      duration: "1 Year",
      features: ["Premium listing", "Unlimited photos", "24/7 support", "Advanced analytics", "Featured placement"],
      isActive: true
    },
  ];

  const [plans, setPlans] = useState<PlanProps[]>(initialPlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanProps | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePlanStatus = (id: number) => {
    setPlans(plans.map(plan =>
      plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
    ));
  };

  const deletePlan = (id: number) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const editPlan = (plan: PlanProps) => {
    setCurrentPlan(plan);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const addNewPlan = () => {
    setCurrentPlan({
      id: Math.max(...plans.map(p => p.id), 0) + 1,
      name: "",
      price: 0,
      duration: "",
      features: [],
      isActive: true
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPlan: PlanProps = {
      id: currentPlan?.id || Math.max(...plans.map(p => p.id), 0) + 1,
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      duration: formData.get('duration') as string,
      features: (formData.get('features') as string).split(',').map(f => f.trim()),
      isActive: formData.get('isActive') === 'on'
    };

    if (isEditMode && currentPlan) {
      setPlans(plans.map(plan => plan.id === newPlan.id ? newPlan : plan));
    } else {
      setPlans([...plans, newPlan]);
    }

    setIsModalOpen(false);
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
                placeholder="Search plans..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className={`p-6 ${plan.isActive ? 'bg-gradient-to-r from-primary/40 to-primary/20' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
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
                          onClick={() => togglePlanStatus(plan.id)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title={plan.isActive ? "Deactivate" : "Activate"}
                        >
                          {plan.isActive ? <FiToggleRight className="text-green-500" /> : <FiToggleLeft className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/{plan.duration}</span>
                    </div>
                    <div className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <SubscriptionModal setIsModalOpen={setIsModalOpen} handleSubmit={handleSubmit} isEditMode={isEditMode} />
      )}
    </div>
  )
}

export default Subscription