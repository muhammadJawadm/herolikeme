import { useState } from "react";
import Header from "../../layouts/partials/Header"
import { MicIcon, PlayIcon } from "../../components/Icons";

interface User {
  profilePicture: string;
  name: string;
  email: string;
  status: string;
  phoneNumber: string;
  contact: string;
  age: number;
  gender: string;
  wantToMeet: string;
  goal: string;
  zipCode: string;
  address: string;
  impactedByCancer: boolean;
  impactedByChronicConditions: boolean;
  images: string[];
  voiceMessage: string[];
  bio:string;
  interests:string[]
}
const mockUser: User = {
  profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  name: "Jane Smith",
  email: "jane.smith@example.com",
  status: "Active",
  phoneNumber: "+1 (555) 123-4567",
  contact: "Email preferred",
  age: 32,
  gender: "Female",
  wantToMeet: "Friends with similar interests",
  goal: "Build meaningful connections",
  zipCode: "90210",
  address: "123 Main St, Beverly Hills, CA",
  impactedByCancer: true,
  impactedByChronicConditions: false,
   bio: "Passionate about technology and community building. Love connecting with people and learning new things every day.",
  interests: ["Traveling", "Photography", "Fitness", "Cooking", "Reading"],
  images: [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
  ],
  voiceMessage: ["voice-message-url"]
};
const UsersDetail = () => {
 const [user] = useState<User>(mockUser);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  return (
<div className="min-h-screen bg-gray-50">
      <Header header={"Manage Users"} link="" />
      
     <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-2 right-2">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    user.status === "Active" 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {user.status === "Active" ? "✓" : "✗"}
                  </span>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.status}
                  </span>
                  
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {user.age} years
                  </span>
                  
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {user.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {/* User Info Grid */}
             <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Bio
              </h3>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>

            {/* Interests Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-pink-50 text-secondary rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Phone</span>
                  <span className="text-gray-800">{user.phoneNumber}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Preferred Contact</span>
                  <span className="text-gray-800">{user.contact}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Looking For</span>
                  <span className="text-gray-800">{user.wantToMeet}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Goal</span>
                  <span className="text-gray-800">{user.goal}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Zip Code</span>
                  <span className="text-gray-800">{user.zipCode}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Address</span>
                  <span className="text-gray-800">{user.address}</span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Impacted by Cancer</span>
                  <span className={`font-medium ${user.impactedByCancer ? 'text-green-600' : 'text-red-600'}`}>
                    {user.impactedByCancer ? "Yes" : "No"}
                  </span>
                </div>
                
                <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500 font-medium">Impacted by Chronic Conditions</span>
                  <span className={`font-medium ${user.impactedByChronicConditions ? 'text-green-600' : 'text-red-600'}`}>
                    {user.impactedByChronicConditions ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Gallery</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`User Image ${idx + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-opacity-80 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Message Section */}
            {user.voiceMessage.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Voice Message</h3>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full mr-4">
                    <MicIcon />
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700">Voice message available</p>
                    <div className="mt-2 flex items-center">
                      <div className="h-2 bg-blue-200 rounded-full w-full mr-3">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">2:45</span>
                    </div>
                  </div>
                  
                  <button className="ml-4 bg-primary text-white p-2 rounded-full">
                    <PlayIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button 
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default UsersDetail
