import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaQuoteLeft, FaRegCommentDots, FaUser } from "react-icons/fa";
import Header from "../../layouts/partials/Header";
import ChartOne from "../../components/ChartOne";
import { MdPayment, MdSubscriptions } from "react-icons/md";
import PieChartBox from "../../components/PieChartBox";
interface MonthlyBookingData{
    users:number[],
    earnings:number[]
}
const Home:React.FC = () => {

   const [monthlyData] = useState<MonthlyBookingData>({
 users: [120, 190, 170, 220, 300, 280, 350, 400, 380, 450, 500, 600],
    earnings: [2400, 3800, 3400, 4400, 6000, 5600, 7000, 8000, 7600, 9000, 10000, 12000],
});
    const [diseaseData] = useState({
    labels: ["Cancer", "Diabetes", "Heart Disease", "Asthma", "Other"],
    values: [40, 25, 20, 10, 5],
  });

  const [countryData] = useState({
    labels: ["USA", "UK", "Pakistan", "India", "Germany", "Other"],
    values: [120, 90, 70, 60, 40, 30],
  });
const [ageData] = useState({
  labels: ["18-25", "26-35", "36-45", "46-60", "60+"],
  values: [120, 200, 150, 80, 40],
});

  return (
  <div className="min-h-screen bg-gray-50">
  <Header header={"Dashboard"} link="" />

  <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
    {/* Cards Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <Card title="Users" count="03" icon={FaUser} link="/users" percentage="+12%" />
      <Card title="Quotes" count="03" icon={FaQuoteLeft} link="/products" percentage="+5%" />
      <Card title="Feedback" count="03" icon={FaRegCommentDots} link="/posts" percentage="+8%" />
      <Card title="Discussions" count="03" icon={FaCommentDots} link="/reels" percentage="+8%" />
      <Card title="Subscription" count="03" icon={MdSubscriptions} link="/payment" percentage="+8%" />
      <Card title="Payments" count="03" icon={MdPayment} link="/payment" percentage="+8%" />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Line Chart (Main Chart, larger span) */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <ChartOne monthlyData={monthlyData} />
      </div>

      {/* Side Pie Charts */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <PieChartBox title="User Diseases" chartData={diseaseData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <PieChartBox title="User Countries" chartData={countryData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <PieChartBox title="User Age Statistics" chartData={ageData} />
        </div>
      </div>
    </div>

  </div>
</div>

  )
}

export default Home
interface CardProps {
  title: string;
  count: string;
  icon: React.ElementType;
  link: string;
  percentage: string;
}
const Card = ({ title, count, icon: Icon, link, percentage }: CardProps) => (
  <Link to={link} className="w-full block transition-transform duration-300 hover:scale-[1.02]">
    <div className="rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative">
      {/* Background decorative element */}
      
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        
        <span className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
          percentage?.includes('-') 
            ? 'text-[#C00402] bg-red-100/70' 
            : 'text-green-600 bg-green-100/70'
        }`}>
          {percentage?.includes('-') ? '↓' : '↑'} {percentage}
        </span>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-2xl font-bold text-gray-900 mb-1">{count}</h4>
        <span className="text-sm font-medium text-gray-600 tracking-wide">{title}</span>
      </div>
      
      {/* Subtle hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/70 to-primary/30 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
    </div>
  </Link>
);