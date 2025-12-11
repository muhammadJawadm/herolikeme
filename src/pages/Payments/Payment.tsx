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

  // Calculate total revenue from completed payments
  const totalRevenue = payments
    .filter((p) => p.priceStatus === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <Header header={"Payments"} link="" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        {/* Total Revenue Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4m8-4h-4m-8 0H4" />
              </svg>
            </div>
          </div>
        </div>
        {/* ...existing code... */}
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
