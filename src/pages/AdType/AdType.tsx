import { FiSearch, FiImage } from "react-icons/fi";
import Header from "../../layouts/partials/Header";
import { useState, useEffect } from "react";
import {
  fetchAds,
  addAd,
  updateAd,
  deleteAd,
  uploadAdImage,
  type Ad,
} from "../../services/adsServices";

const AdType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    ad_url: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const refreshAds = async () => {
    setIsLoading(true);
    const data = await fetchAds();
    setAds(data);
    setFilteredAds(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAds();
  }, []);

  useEffect(() => {
    let filtered = ads;

    if (searchTerm) {
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }



    setFilteredAds(filtered);
  }, [searchTerm, ads]);

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedAd(null);
    setFormData({ title: "", description: "", ad_url: "" });
    setImageFile(null);
    setImagePreview("");
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (ad: Ad) => {
    setIsEdit(true);
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      ad_url: ad.ad_url,
    });
    setImageFile(null);
    setImagePreview(ad.image_url);
    setError(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!isEdit && !imageFile) {
      setError("Image is required");
      return;
    }
    if(!formData.ad_url){
      setError("Ad URL is required");
      return;
    }
    if(formData.ad_url){
      if(!formData.ad_url.startsWith("http://") && !formData.ad_url.startsWith("https://")){
        formData.ad_url = "https://" + formData.ad_url;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrl = isEdit && selectedAd ? selectedAd.image_url : "";

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadAdImage(imageFile);
        if (!uploadedUrl) {
          setError("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      if (isEdit && selectedAd) {
        const updates: Partial<Omit<Ad, "id" | "created_at">> = {
          title: formData.title,
          description: formData.description || null,
          ad_url: formData.ad_url,
        };

        if (imageFile && imageUrl) {
          updates.image_url = imageUrl;
        }

        console.log("Updating ad with ID:", selectedAd.id, "Updates:", updates);
        const result = await updateAd(selectedAd.id, updates);
        console.log("Update result:", result);
        
        if (result) {
          await refreshAds();
          setShowModal(false);
        } else {
          setError("Failed to update ad. Please check console for details.");
        }
      } else {
        const result = await addAd({
          title: formData.title,
          description: formData.description || null,
          image_url: imageUrl,
          impressions: 0,
          click_rates: 0,
          clicks: 0,
          ad_url: formData.ad_url,
        });
        if (result) {
          await refreshAds();
          setShowModal(false);
        } else {
          setError("Failed to add ad");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      console.log("Deleting ad with ID:", id);
      const success = await deleteAd(id);
      console.log("Delete result:", success);
      
      if (success) {
        await refreshAds();
      } else {
        alert("Failed to delete ad. Please check console for details.");
      }
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
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
              onClick={openAddModal}
              className="px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg shadow hover:bg-secondary/90 transition-colors"
            >
              + Add Ad
            </button>
          </div>
          
        <div className="overflow-x-auto">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Impressions</th>
                  <th className="px-4 py-3 text-left">Click Rates</th>
                  <th className="px-4 py-3 text-left">Clicks</th>
                  <th className="px-4 py-3 text-left">Created At</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-gray-500">Loading ads...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAds.length > 0 ? (
                  filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700 font-medium">{ad.id}</td>
                      <td className="px-6 py-4">
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => openImageModal(ad.image_url)}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {ad.title}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="line-clamp-2 text-gray-700">
                          {ad.description || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {ad.impressions?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {ad.click_rates?.toLocaleString() || 0}%
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {ad.clicks?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(ad.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openEditModal(ad)}
                          className="text-blue-600 cursor-pointer hover:underline mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-500 cursor-pointer hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No ads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>

      {/* Add/Edit Ad Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update Ad" : "Add New Ad"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter ad title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>
<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Url <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ad_url}
                  onChange={(e) =>
                    setFormData({ ...formData, ad_url: e.target.value })
                  }
                  placeholder="Enter ad Url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter ad description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            Click to change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiImage className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or JPEG (MAX. 5MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : isEdit ? "Update Ad" : "Add Ad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Ad Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};



export default AdType
