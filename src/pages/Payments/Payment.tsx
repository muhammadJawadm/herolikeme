import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { supabase } from "../../lib/supabase";

interface SubRow {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: string;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  // filled in after merge
  email?: string;
  plan_name?: string;
  price?: number;
  currency?: string;
}

const Payment = () => {
  const [rows, setRows] = useState<SubRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    // 1. subscriptions
    const { data: subs, error: e1 } = await supabase
      .from("user_subscriptions")
      .select("id, user_id, plan_id, status, subscription_start_date, subscription_end_date")
      .order("subscription_start_date", { ascending: false });

    if (e1 || !subs) {
      setError("Failed to load subscriptions.");
      setIsLoading(false);
      return;
    }

    // 2. emails from public.users
    const userIds = [...new Set(subs.map((s) => s.user_id))];
    const { data: users } = await supabase
      .from("users")
      .select("id, email")
      .in("id", userIds);

    // 3. plan names + price
    const planIds = [...new Set(subs.map((s) => s.plan_id).filter(Boolean))];
    const { data: plans } = await supabase
      .from("subscription_plans")
      .select("id, plan_name, price, currency")
      .in("id", planIds);

    
    const emailMap: Record<string, string> = {};
    users?.forEach((u) => { emailMap[u.id] = u.email; });

    const planMap: Record<string, { plan_name: string; price: number; currency: string }> = {};
    plans?.forEach((p) => { planMap[p.id] = { plan_name: p.plan_name, price: p.price, currency: p.currency }; });

    setRows(
      subs.map((s) => ({
        ...s,
        email: emailMap[s.user_id] ?? "—",
        plan_name: s.plan_id ? (planMap[s.plan_id]?.plan_name ?? "—") : "—",
        price: s.plan_id ? planMap[s.plan_id]?.price : undefined,
        currency: s.plan_id ? (planMap[s.plan_id]?.currency ?? "USD") : undefined,
      }))
    );
    setIsLoading(false);
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":     return "bg-green-100 text-green-800";
      case "inactive":   return "bg-gray-100 text-gray-700";
      case "cancelled":  return "bg-red-100 text-red-800";
      case "expired":    return "bg-orange-100 text-orange-800";
      default:           return "bg-yellow-100 text-yellow-800";
    }
  };

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const activeCount = rows.filter((r) => r.status.toLowerCase() === "active").length;

  return (
    <div>
      <Header header={"Payments"} link="" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">

        <div className="mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Active Subscriptions</p>
              <h3 className="text-3xl font-bold">{activeCount}</h3>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4m8-4h-4m-8 0H4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-red-500">{error}</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">No subscriptions found.</td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="bg-white hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{row.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.plan_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {row.price != null ? `${row.currency ?? "USD"} ${row.price.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{fmt(row.subscription_start_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{fmt(row.subscription_end_date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
