import { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { fetchContentByType, saveContent } from '../../services/contentServices';
import type { Content } from '../../services/contentServices';

const TermsConditions = () => {
  const [content, setContent] = useState<Content | null>(null);
  const [editableContent, setEditableContent] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchContentByType('terms');
      setContent(data);
      setEditableContent(data?.description || '');
    } catch (err) {
      console.error('Error loading terms & conditions:', err);
      setError('Failed to load terms & conditions content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setEditableContent(content?.description || '');
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditableContent(content?.description || '');
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const savedContent = await saveContent(
        'terms',
        editableContent,
        content?.id
      );

      setContent(savedContent);
      setIsEditMode(false);
      setSuccessMessage('Terms & conditions updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving terms & conditions:', err);
      setError('Failed to save terms & conditions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms & conditions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your application's terms and conditions content
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditMode ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <FiEdit2 className="text-lg" />
                  Edit Content
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md"
                  >
                    <FiX className="text-lg" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="text-lg" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {isEditMode ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Terms & Conditions Content
              </label>
              <textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Enter your terms and conditions content here..."
              />
              <p className="text-sm text-gray-500 mt-2">
                You can use plain text or HTML formatting in the content above.
              </p>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              {content?.description ? (
                <div
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiEdit2 className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Terms & Conditions Content
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Click the "Edit Content" button above to add your terms and conditions.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Last Updated Info */}
        {content?.created_at && !isEditMode && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Last updated: {new Date(content.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsConditions;
