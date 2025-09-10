
import React, { useState } from "react";
import { FaLock, FaSignInAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
interface LoginFormValues{
  username:string;
  password:string;
}
const Login:React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormValues>({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
 
  };
  return  <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">System Login</h1>
    
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Login as</label>
       
      </div>

      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 mb-2">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-gray-500" />
          </div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter your username"

          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-500" />
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md "
            placeholder="Enter your password"

          />
        </div>
      </div>


      <button
      type="button"
      onClick={()=>{navigate('/')}}
        className="w-full bg-primary cursor-pointer text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-200"
      >
       <span className="flex items-center">
            <FaSignInAlt className="mr-2" />
            Log In
          </span>
      </button>
    </form>
  </div>
</div>
};

export default Login;
