import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaRegCommentDots, FaUser } from "react-icons/fa";
import Header from "../../layouts/partials/Header";
import ChartOne from "../../components/ChartOne";
import { MdPayment, MdSubscriptions } from "react-icons/md";
import PieChartBox from "../../components/PieChartBox";
import { fetchUsers } from "../../services/usersServices";
import { fetchQuotes } from "../../services/quoteServices";
import { fetchFeedback } from "../../services/feedbackServices";
import { fetchCommunities } from "../../services/communityServices";
import { fetchNotifications } from "../../services/notificationServices";

interface MonthlyBookingData {
  users: number[];
  earnings: number[];
  premiumUsers?: number[];
}

interface DashboardStats {
  totalUsers: number;
  totalQuotes: number;
  totalFeedback: number;
  totalDiscussions: number;
  totalNotifications: number;
  premiumUsers: number;
  onlineUsers: number;
  completedProfiles: number;
  newUsersThisWeek: number;
  newPremiumUsersThisWeek: number;
}

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQuotes: 0,
    totalFeedback: 0,
    totalDiscussions: 0,
    totalNotifications: 0,
    premiumUsers: 0,
    onlineUsers: 0,
    completedProfiles: 0,
    newUsersThisWeek: 0,
    newPremiumUsersThisWeek: 0,
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyBookingData>({
    users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    earnings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const [diseaseData, setDiseaseData] = useState({
    labels: ["Cancer", "Chronic Conditions", "Others"],
    values: [0, 0, 0],
  });

  const [countryData, setCountryData] = useState({
    labels: [] as string[],
    values: [] as number[],
  });

  const [ageData, setAgeData] = useState({
    labels: [] as string[],
    values: [] as number[],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data
      const [users, quotes, feedback, communities, notifications] = await Promise.all([
        fetchUsers(),
        fetchQuotes(),
        fetchFeedback(),
        fetchCommunities(),
        fetchNotifications(),
      ]);

      // Calculate basic stats
      // Get users from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const newUsersThisWeek = users.filter(u => {
        const userCreatedDate = new Date(u.created_at);
        return userCreatedDate >= sevenDaysAgo;
      }).length;

      const newPremiumUsersThisWeek = users.filter(u => {
        const userCreatedDate = new Date(u.created_at);
        return userCreatedDate >= sevenDaysAgo && u.is_premium;
      }).length;

      setStats({
        totalUsers: users.length,
        totalQuotes: quotes.length,
        totalFeedback: feedback.length,
        totalDiscussions: communities.length,
        totalNotifications: notifications.length,
        premiumUsers: users.filter(u => u.is_premium).length,
        onlineUsers: users.filter(u => u.is_online).length,
        completedProfiles: users.filter(u => u.is_profile_complete).length,
        newUsersThisWeek,
        newPremiumUsersThisWeek,
      });

      // Process monthly user registration data - separate regular and premium
      const monthlyUsers = Array(12).fill(0);
      const monthlyPremiumUsers = Array(12).fill(0);
      
      users.forEach(user => {
        const month = new Date(user.created_at).getMonth();
        monthlyUsers[month]++;
        if (user.is_premium) {
          monthlyPremiumUsers[month]++;
        }
      });

      // Calculate earnings (premium users * estimated subscription cost)
      const monthlyEarnings = monthlyPremiumUsers.map(count => count * 10);

      setMonthlyData({
        users: monthlyUsers,
        earnings: monthlyEarnings,
        premiumUsers: monthlyPremiumUsers,
      });

      // Process disease data
      const cancerCount = users.filter(u => u.user_profiles?.is_cancer).length;
      const chronicCount = users.filter(u => u.user_profiles?.is_other_chronic).length;
      const othersCount = users.length - cancerCount - chronicCount;

      setDiseaseData({
        labels: ["Cancer", "Chronic Conditions", "Others"],
        values: [cancerCount, chronicCount, othersCount],
      });

      // Process country data
      const countryMap = new Map<string, number>();
      users.forEach(user => {
        if (user.user_profiles?.country) {
          countryMap.set(user.user_profiles.country, (countryMap.get(user.user_profiles.country) || 0) + 1);
        }
      });

      const sortedCountries = Array.from(countryMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      setCountryData({
        labels: sortedCountries.map(([country]) => country),
        values: sortedCountries.map(([, count]) => count),
      });

      // Process age data
      const ageMap = new Map<string, number>();
      users.forEach(user => {
        if (user.user_profiles?.age_range) {
          ageMap.set(user.user_profiles.age_range, (ageMap.get(user.user_profiles.age_range) || 0) + 1);
        }
      });

      const sortedAges = Array.from(ageMap.entries()).sort((a, b) => {
        // Sort by age range start
        const aStart = parseInt(a[0].split('-')[0]);
        const bStart = parseInt(b[0].split('-')[0]);
        return aStart - bStart;
      });

      setAgeData({
        labels: sortedAges.map(([age]) => age),
        values: sortedAges.map(([, count]) => count),
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header header={"Dashboard"} link="" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header header={"Dashboard"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card 
            title="New Users This week" 
            count={stats.newUsersThisWeek.toString()} 
            icon={FaUser} 
            link="/users" 
            subtitle="Last 7 days"
          />
          <Card 
            title="Total Users" 
            count={stats.totalUsers.toString()} 
            icon={FaUser} 
            link="/users" 
            subtitle={`${stats.onlineUsers} online`}
          />
          <Card 
            title="Feedback" 
            count={stats.totalFeedback.toString()} 
            icon={FaRegCommentDots} 
            link="/feedback" 
            subtitle="User feedback"
          />
          <Card 
            title="Communities" 
            count={stats.totalDiscussions.toString()} 
            icon={FaCommentDots} 
            link="/discussion" 
            subtitle="Discussions"
          />
          <Card 
            title="New Premium Users This week" 
            count={stats.newPremiumUsersThisWeek.toString()} 
            icon={MdSubscriptions} 
            link="/users" 
            subtitle="Last 7 days"
          />
          <Card 
            title="Notifications" 
            count={stats.totalNotifications.toString()} 
            icon={MdPayment} 
            link="/notifications" 
            subtitle="Total sent"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Online Users</p>
                <h3 className="text-3xl font-bold">{stats.onlineUsers}</h3>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <FaUser className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Verified Profiles</p>
                <h3 className="text-3xl font-bold">{stats.completedProfiles}</h3>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <FaUser className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Profile Completion Rate</p>
                <h3 className="text-3xl font-bold">
                  {stats.totalUsers > 0 ? ((stats.completedProfiles / stats.totalUsers) * 100).toFixed(1) : 0}%
                </h3>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <FaUser className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart (Main Chart, larger span) */}
          <div className="lg:col-span-2 pt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <ChartOne monthlyData={monthlyData} />
          </div>

          {/* Side Pie Charts */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <PieChartBox title="Health Conditions" chartData={diseaseData} />
            </div>
            {countryData.labels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <PieChartBox title="Top Countries" chartData={countryData} />
              </div>
            )}
            {ageData.labels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <PieChartBox title="Age Distribution" chartData={ageData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
interface CardProps {
  title: string;
  count: string;
  icon: React.ElementType;
  link: string;
  subtitle?: string;
}

const Card = ({ title, count, icon: Icon, link, subtitle }: CardProps) => (
  <Link to={link} className="w-full block transition-transform duration-300 hover:scale-[1.02]">
    <div className="rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-3xl font-bold text-gray-900 mb-1">{count}</h4>
        <span className="text-sm font-semibold text-gray-700 tracking-wide block mb-1">{title}</span>
        {subtitle && (
          <span className="text-xs text-gray-500">{subtitle}</span>
        )}
      </div>
      
      {/* Subtle hover indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/70 to-primary/30 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
    </div>
  </Link>
);