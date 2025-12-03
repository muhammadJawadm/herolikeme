import Header from "../../layouts/partials/Header";
import { useState, useEffect } from "react";
import { fetchCategories, deleteCategory, type CategoryGroup } from "../../services/categoryServices";
import CategoriesModal from "../../components/CategoriesModal";



const Categories = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup | null>(null);

  const refreshCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const deleteCategories = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteCategory(id);
      if (success) {
        await refreshCategories();
      }
    }
  };

  const openEditModal = (category: CategoryGroup) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setAddModalOpen(true);
  }; 


  return (
    <div>
      <Header header={"Manage Categories"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-secondary text-white rounded-lg shadow hover:bg-secondary/90 transition-colors"
          >
            + Add Category
          </button>
        </div>
             
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
                <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                 <tr>
              <th className="px-6 py-3">Categories</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
                </thead>
                  <tbody className="divide-y divide-gray-200/60">
                   {categories.map((category) => (
              <tr key={category.id} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">
                  {category.title}
                </td>
                <td className="px-6 py-3 ">
                  <button
                    className="px-4 py-2  text-blue-500 rounded-lg hover:text-blue-800 hover:bg-blue-400 transition-colors"
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors" 
                    onClick={() => deleteCategories(category.id)}
                  >
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
      {addModalOpen && (
        <CategoriesModal 
          setModalOpen={setAddModalOpen} 
          modalOpen={addModalOpen} 
          isUpdate={false}
          refreshCategories={refreshCategories}
          categoryData={null}
        /> 
      )}

      {editModalOpen && selectedCategory && (
        <CategoriesModal 
          setModalOpen={setEditModalOpen} 
          modalOpen={editModalOpen} 
          isUpdate={true}
          refreshCategories={refreshCategories}
          categoryData={selectedCategory}
        /> 
      )}

    </div>
  )
}

export default Categories;
