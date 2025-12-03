import { useState, useEffect } from "react";
import { addCategory, updateCategory, type CategoryGroup } from "../services/categoryServices";


interface CategoryAddModalProps {
  modalOpen: boolean;
  isUpdate: boolean;
  setModalOpen: (val: boolean) => void;
  refreshCategories: () => Promise<void>;
  categoryData: CategoryGroup | null;
}

const CategoriesModal = ({setModalOpen, modalOpen, isUpdate, refreshCategories, categoryData}: CategoryAddModalProps) => { 
  const [formData, setFormData] = useState({
    title: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    if (isUpdate && categoryData) {
      setFormData({
        title: categoryData.title    
      });
    }
  }, [isUpdate, categoryData]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Category is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isUpdate && categoryData) {
        // Update existing category
        const result = await updateCategory(categoryData.id, { title: formData.title });
        if (result) {
          await refreshCategories();
          setModalOpen(false);
        } else {
          setError("Failed to update category");
        }
      } else {
        // Add new category
        const result = await addCategory({ title: formData.title });
        if (result) {
          await refreshCategories();
          setModalOpen(false);
        } else {
          setError("Failed to add category");
        }    
      }
    } catch (err) {
      setError("An error occurred while processing your request");
    } finally {
      setIsSubmitting(false);
    }
  };


if(!modalOpen) return null;


return (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {isUpdate ? "Edit Category" : "Add Category"}   
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter category (e.g., Motivation, Inspiration)"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>)
}
export default CategoriesModal;
