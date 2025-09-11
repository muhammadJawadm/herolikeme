
import { FiSearch } from "react-icons/fi";
import Header from "../../layouts/partials/Header";
import { Link } from "react-router-dom";
import { useState } from "react";

interface User {
id:number;
name:string;
email : string;
phoneNumber:string;
address:string;
profilePicture:string;
status:string;
}
const Users:React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
    const usersData:User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+123456789",
    address: "street 4, Islamabad",
    profilePicture: "https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+987654321",
    address: "street 4, Islamabad",
    profilePicture: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    address: "street 4, Islamabad",
    phoneNumber: "+1122334455",
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    status: "Active",
  },
]
  return (
     <div>
      <Header header={"Manage Matches"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
      
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                   <div className="relative w-full sm:w-96">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <FiSearch className="text-gray-400" />
                     </div>
                     <input
                       type="text"
                       className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                       placeholder="Search users..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                   </div>
                 </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phn. No</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {usersData.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture}
                          alt="User"
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                        />
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-700/90">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-700/90">
                      {user.address}
                    </td>
                     
                   
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                     <td className="px-6 py-3">
                        <Link 
                        to={`${user.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                      >View
                      </Link>
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

export default Users
