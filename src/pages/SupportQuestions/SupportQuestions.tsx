import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch, FiHelpCircle, FiHeart } from "react-icons/fi";
import {
  fetchSupportQuestions,
  addSupportQuestion,
  updateSupportQuestion,
  deleteSupportQuestion,
  type SupportQuestion,
} from "../../services/supportQuestionsServices";

const SupportQuestions = () => {
  const [questions, setQuestions] = useState<SupportQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<SupportQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"help_center" | "nurse_health">("help_center");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SupportQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    type: "help_center" as "help_center" | "nurse_health",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshQuestions = async () => {
    setIsLoading(true);
    const data = await fetchSupportQuestions();
    setQuestions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshQuestions();
  }, []);

  useEffect(() => {
    let filtered = questions.filter((q) => q.type === activeTab);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [searchTerm, activeTab, questions]);

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedQuestion(null);
    setFormData({
      question: "",
      answer: "",
      type: activeTab,
    });
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (question: SupportQuestion) => {
    setIsEdit(true);
    setSelectedQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      type: question.type,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && selectedQuestion) {
        const result = await updateSupportQuestion(selectedQuestion.id, formData);
        if (result) {
          await refreshQuestions();
          setShowModal(false);
        } else {
          setError("Failed to update question");
        }
      } else {
        const result = await addSupportQuestion(formData);
        if (result) {
          await refreshQuestions();
          setShowModal(false);
        } else {
          setError("Failed to add question");
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
    if (window.confirm("Are you sure you want to delete this question?")) {
      const success = await deleteSupportQuestion(id);
      if (success) {
        await refreshQuestions();
      }
    }
  };

  const getQuestionCount = (type: "help_center" | "nurse_health") => {
    return questions.filter((q) => q.type === type).length;
  };

  return (
    <div>
      <Header header={"Support Questions"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Help Center</p>
                <p className="text-2xl font-bold text-blue-900">{getQuestionCount("help_center")}</p>
              </div>
              <FiHelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-700 font-medium">Nurse & Health</p>
                <p className="text-2xl font-bold text-pink-900">{getQuestionCount("nurse_health")}</p>
              </div>
              <FiHeart className="w-8 h-8 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("help_center")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "help_center"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiHelpCircle className="w-5 h-5" />
            Help Center
          </button>
          <button
            onClick={() => setActiveTab("nurse_health")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "nurse_health"
                ? "bg-pink-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiHeart className="w-5 h-5" />
            Nurse & Health
          </button>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg shadow hover:bg-secondary/90 transition-colors"
          >
            + Add Question
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-500">Loading questions...</span>
            </div>
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          question.type === "help_center"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {question.type === "help_center" ? "Help Center" : "Nurse & Health"}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: {question.id}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {question.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{question.answer}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    <span>Created: {new Date(question.created_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>Updated: {new Date(question.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(question)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer hover:underline font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg mb-2">No questions found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm
                  ? "Try adjusting your search"
                  : `Add your first ${
                      activeTab === "help_center" ? "Help Center" : "Nurse & Health"
                    } question`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update Question" : "Add Question"}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "help_center" | "nurse_health",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="help_center">Help Center</option>
                  <option value="nurse_health">Nurse & Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter question"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter answer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={6}
                  disabled={isSubmitting}
                />
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
                  {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportQuestions;
