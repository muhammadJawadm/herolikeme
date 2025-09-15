import { FiSearch } from "react-icons/fi"
import Header from "../../layouts/partials/Header"
import { useState } from "react";
interface AdItem {
  id: number;
  title: string;
  description: string;
  category: string;
  advertiser: string;
}

const AdType = () => {
    const [searchTerm, setSearchTerm] = useState("");
  const [ads, setAds] = useState<AdItem[]>([
    {
      id: 1,
      title: "Summer Sale",
      description: "Get 50% off on all products this summer!",
      category: "Promotion",
      advertiser: "Jane Smith",
    },
    {
      id: 2,
      title: "Job Hiring",
      description: "We are hiring software engineers.",
      category: "Jobs",
      advertiser: "John Doe",
    },
    {
      id: 3,
      title: "New Restaurant",
      description: "Grand opening of Italian cuisine in your city.",
      category: "Food",
      advertiser: "Michael Johnson",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    category: "",
    advertiser: "",
  });

  const handleAddAd = () => {
    if (newAd.title && newAd.description && newAd.category && newAd.advertiser) {
      const newItem: AdItem = {
        id: ads.length + 1,
        ...newAd,
      };
      setAds([...ads, newItem]);
      setNewAd({ title: "", description: "", category: "", advertiser: "" });
      setShowModal(false);
    }
  };
  return (
 <div>
      <div>
        <Header header={"Manage Ads"} link="" />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                placeholder="Search ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg shadow"
            >
              + Add Ad
            </button>
          </div>
          
        <div className="overflow-x-auto">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Advertiser</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {ads.map((ad) => (
                  <tr key={ad.id}>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {ad.title}
                    </td>
                    <td className="px-6 py-4">{ad.description}</td>
                    <td className="px-6 py-4">{ad.category}</td>
                    <td className="px-6 py-4">{ad.advertiser}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 cursor-pointer hover:underline mr-3">
                        Edit
                      </button>
                      <button className="text-red-500 cursor-pointer hover:text-red-700 font-medium">
                        Delete
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

      {/* Add Ad Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Ad</h2>

            <input
              type="text"
              placeholder="Ad Title"
              value={newAd.title}
              onChange={(e) =>
                setNewAd({ ...newAd, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Ad Description"
              value={newAd.description}
              onChange={(e) =>
                setNewAd({ ...newAd, description: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Category"
              value={newAd.category}
              onChange={(e) =>
                setNewAd({ ...newAd, category: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Advertiser"
              value={newAd.advertiser}
              onChange={(e) =>
                setNewAd({ ...newAd, advertiser: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAd}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add Ad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default AdType
