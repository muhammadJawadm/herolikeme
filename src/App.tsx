
import { Route, Routes } from 'react-router-dom'
import './App.css'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home/Home'
import Users from './pages/Users/Users'
import Login from './pages/Auth/Login'
import UsersDetail from './pages/Users/UsersDetail'
import Content from './pages/Content/Content'
import Quotes from './pages/Quotes/Quotes'
import Feedback from './pages/Feedback/Feedback'
import Discussions from './pages/Discussions/Discussions'
import Subscription from './pages/Subscription/Subscription'
import Payment from './pages/Payments/Payment'
import AdType from './pages/AdType/AdType'
import Notifications from './pages/Notifications/Notifications'
import DataDownloadRequests from './pages/DataDownloadRequests/DataDownloadRequests'
import Categories from './pages/Categories/Categories'
import SupportQuestions from './pages/SupportQuestions/SupportQuestions'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UsersDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/ads" element={<AdType />} />
          <Route path="/discussion" element={<Discussions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/download-requests" element={<DataDownloadRequests />} />
          <Route path="/support-questions" element={<SupportQuestions />} />
          <Route path="/content" element={<Content />} />
          <Route path="/subscriptions" element={<Subscription />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
