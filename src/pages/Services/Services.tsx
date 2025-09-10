import { useState } from "react";
import Header from "../../layouts/partials/Header";
interface Service {
  id: number;
  name: string;
  price: number;
  image: string;
  status: "Available" | "Limited" | "Unavailable";
  description:string;
}


const Services = () => {
    const [servicesData, setServicesData] = useState<Service[]>([
    {
      id: 1,
      name: "Professional Cleaning",
      price: 99.99,
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Available",
      description:"Cleaning service"
    },
    {
      id: 2,
      name: "Home Maintenance",
      price: 29.99,
      image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Limited",
       description:"Maintenance service"
    },
    {
      id: 3,
      name: "Personal Training",
      price: 24.95,
      image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Unavailable",
       description:"personal training"
    },
    {
      id: 4,
      name: "IT Support",
      price: 199.99,
      image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Available",
       description:"IT support"
    },
    {
      id: 5,
      name: "Consultation",
      price: 49.99,
      image: "https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Limited",
       description:"Consultancy service"
    },
  ]);
  const toggleServiceStatus = (id: number) => {
    setServicesData(prevServices => 
      prevServices.map(service => 
        service.id === id 
          ? {
              ...service,
              status: 
                service.status === "Available" ? "Limited" :
                service.status === "Limited" ? "Unavailable" : "Available"
            } 
          : service
      )
    );
  };

  return (
      <div>
      <Header header={"Manage Services"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {servicesData.map((service) => (
                  <tr
                    key={service.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                        />
                        <span className="font-medium text-gray-800">
                          {service.name}
                        </span>
                      </div>
                    </td>
                   
                    <td className="px-6 py-3 font-mono text-gray-700/90">
                      ${service.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-700/90">
                      {service.description}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : service.status === "Limited"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button 
                        onClick={() => toggleServiceStatus(service.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
                      >
                        Toggle Status
                      </button>
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

export default Services
