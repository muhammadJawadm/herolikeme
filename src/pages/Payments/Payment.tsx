import { useState } from "react";
import Header from "../../layouts/partials/Header";
interface Payment {
  id: number;
  user: string;
  amount: number;
  priceStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod: string;
}

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      user: "John Smith",
      amount: 130.5,
      priceStatus: "Completed",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      amount: 78.0,
      priceStatus: "Refunded",
      paymentMethod: "PayPal",
    },
    {
      id: 3,
      user: "Michael Brown",
      amount: 300.99,
      priceStatus: "Pending",
      paymentMethod: "Debit Card",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (
    paymentId: number,
    newStatus: Payment["priceStatus"]
  ) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId
          ? { ...payment, priceStatus: newStatus }
          : payment
      )
    );
  };

  const statusOptions: Payment["priceStatus"][] = [
    "Pending",
    "Completed",
    "Failed",
    "Refunded",
  ];

  return (
    <div>
      <Header header={"Payments"} link="" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}

        </div>
        <div className="my-3">

          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {payments?.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {payment.user}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      ${payment.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {payment.paymentMethod}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={payment.priceStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            payment.id,
                            e.target.value as Payment["priceStatus"]
                          )
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          payment.priceStatus
                        )} cursor-pointer`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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

export default Payment
