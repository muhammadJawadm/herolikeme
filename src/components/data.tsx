
import { MdDashboardCustomize,  MdSubscriptions, MdPayment, } from "react-icons/md";
import {  FaUsers,FaQuoteLeft ,FaRegCommentDots, FaComments} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
export const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: <MdDashboardCustomize /> },
  { name: "Users", path: "/users", icon: <FaUsers /> },
  { name: "Matches", path: "/matches", icon: <MdSubscriptions /> },
  { name: "Quotes", path: "/quotes", icon: <FaQuoteLeft /> },
  { name: "Feedback", path: "/feedback", icon: <FaRegCommentDots /> },
  { name: "Discussions", path: "/discussion", icon: <FaComments /> },
  { name: "Subscriptions", path: "/subscriptions", icon: <MdSubscriptions /> },
  { name: "Payments", path: "/payment", icon: <MdPayment /> },
  { name: "Content", path: "/content", icon: <HiOutlineDocumentText /> },
];
export const transactionsReports = [
  { id: 1, user: "Alice", amount: "$200", status: "Completed", date: "2025-07-20" },
  { id: 2, user: "Bob", amount: "$150", status: "Pending", date: "2025-07-19" },
  { id: 3, user: "John", amount: "$300", status: "Completed", date: "2025-07-18" },
];
export const reportsData =[
   { id: 1, heading: "Total Payments", amount: "$200",  },
  { id: 2, heading: "Total Users", amount: "$150" },
  { id: 3, heading: "Avg. Transaction", amount: "$300"},
]