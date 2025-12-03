import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, List, Link, BlockQuote, Underline, Strikethrough, Font, Alignment } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import Header from "../../layouts/partials/Header";
import { fetchContentByType, saveContent } from "../../services/contentServices";
import type { Content as ContentType } from "../../services/contentServices";


const Content:React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<"privacyPolicy" | "termsConditions">("privacyPolicy");
  const [editorData, setEditorData] = useState<string>("<p>Start typing here...</p>");
  const [content, setContent] = useState<ContentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [selectedContent]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const type = selectedContent === "privacyPolicy" ? "privacy" : "terms";
      const data = await fetchContentByType(type);
      setContent(data);
      setEditorData(data?.description || "<p>Start typing here...</p>");
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content');
      setEditorData("<p>Start typing here...</p>");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const type = selectedContent === "privacyPolicy" ? "privacy" : "terms";
      const savedContent = await saveContent(type, editorData, content?.id);
      
      setContent(savedContent);
      const contentName = selectedContent === "privacyPolicy" ? "Privacy Policy" : "Terms & Conditions";
      setSuccessMessage(`${contentName} saved successfully!`);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContentTypeChange = (type: "privacyPolicy" | "termsConditions") => {
    setSelectedContent(type);
    setSuccessMessage(null);
    setError(null);
  };
 
  return (
    <div>
      <Header header={"Manage content"} link=""/>
      <div className="max-w-screen-2xl mx-auto">
        <div className="mx-4 sm:mx-9 my-3">
          
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Content Type Selection */}
          <div className="flex flex-wrap gap-4 justify-start bg-white px-4 py-2 rounded-lg shadow-sm">
            <button
              className={`rounded-md w-full sm:w-auto text-sm px-6 py-2 font-medium capitalize transition-all ${
                selectedContent === "privacyPolicy"
                  ? "bg-primary text-white"
                  : "border text-primary hover:bg-gray-50"
              }`}
              onClick={() => handleContentTypeChange("privacyPolicy")}
              disabled={loading || saving}
            >
              Privacy Policy
            </button>
            <button
              className={`rounded-md w-full sm:w-auto text-sm px-6 py-2 font-medium capitalize transition-all ${
                selectedContent === "termsConditions"
                  ? "bg-primary text-white"
                  : "border text-primary hover:bg-gray-50"
              }`}
              onClick={() => handleContentTypeChange("termsConditions")}
              disabled={loading || saving}
            >
              Terms and Conditions
            </button>
          </div>

          {/* Editor Section */}
          <div className="space-y-2 my-3 bg-white p-6 rounded-lg shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading content...</p>
                </div>
              </div>
            ) : (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedContent === "privacyPolicy" ? "Privacy Policy Content" : "Terms & Conditions Content"}
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    licenseKey: "GPL",
                    plugins: [
                      Essentials, 
                      Paragraph, 
                      Bold, 
                      Italic, 
                      Underline, 
                      Strikethrough,
                      Heading, 
                      List, 
                      Link, 
                      BlockQuote,
                      Font,
                      Alignment
                    ],
                    toolbar: [
                      "undo", "redo", "|",
                      "heading", "|",
                      "bold", "italic", "underline", "strikethrough", "|",
                      "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "|",
                      "bulletedList", "numberedList", "|",
                      "alignment", "|",
                      "link", "blockQuote", "|"
                    ],
                    heading: {
                      options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                      ]
                    }
                  }}
                  data={editorData}
                  onChange={(_event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                  }}
                />

                <div className="flex items-center justify-between mt-5">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-white justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-sm font-medium focus:outline-none focus-visible:ring-2 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  
                  {content?.created_at && (
                    <span className="text-sm text-gray-500">
                      Last updated: {new Date(content.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content