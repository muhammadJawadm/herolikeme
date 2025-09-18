
import { Route, Routes } from 'react-router-dom'
import './App.css'
import RootLayout from './layouts/RootLayout'
import './App.css'
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
import Matches from './pages/Matches/Matches'
import AdType from './pages/AdType/AdType'
import Notifications from './pages/Notifications/Notifications'

function App() {

  return (
     <Routes>
    <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path={"/users"} element={<Users />} />
    <Route path={"/users/:id"} element={<UsersDetail />} />
    <Route path={"/feedback"} element={<Feedback />} />
    <Route path={"/payment"} element={<Payment />} />
    <Route path={"/quotes"} element={<Quotes />} />
    <Route path={"/ads"} element={<AdType />} />
    <Route path={"/discussion"} element={<Discussions />} />
    <Route path={"/matches"} element={<Matches />} />
    <Route path={"/notifications"} element={<Notifications />} />
      <Route path={"/content"} element={<Content />} />
      <Route path={"/subscriptions"} element={<Subscription />} />
    </Route>
    <Route path={"/login"} element={<Login />} />
  </Routes>
  )
}

export default App
