import {  useEffect, useState } from "react";
import Header from "../../layouts/partials/Header"
import { fetchFeedback, type Feedbacks } from "../../services/feedbackServices";
import {deleteFeedback} from '../../services/feedbackServices'


const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState<Feedbacks[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedbacks | null>(null);
  const [showModal, setShowModal] = useState(false);

useEffect(()=>{
 const fetchFeedbackData =async()=> {
const data = await fetchFeedback();
setFeedbackData(data);
 }
 fetchFeedbackData();
} )

const deleteFeedbacks =async(id:number)=>{
  if (window.confirm("Are you sure you want to delete this feedback?")) {
    await deleteFeedback(id);
    const data = await fetchFeedback();
    setFeedbackData(data);
  }
}

const openModal = (feedback: Feedbacks) => {
  setSelectedFeedback(feedback);
  setShowModal(true);
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
  return (
     <div>
      <Header header={"Manage Feedback"} link="" />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
      
        <div className="overflow-x-auto">
         <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
          <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
            <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-3 text-left" style={{ width: '60%' }}>Message</th>
                <th className="px-4 py-3 text-left" style={{ width: '20%' }}>Date</th>
                <th className="px-4 py-3 text-center" style={{ width: '20%' }}>Action</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-gray-200/60">
              {feedbackData.map((feedback) => (
                <tr
                  key={feedback.id}>

                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-gray-700 leading-relaxed">
                        {truncateText(feedback.feedback_comment, 150)}
                      </p>
                      {feedback.feedback_comment.length > 150 && (
                        <button
                          onClick={() => openModal(feedback)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium whitespace-nowrap cursor-pointer hover:underline"
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(feedback.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={()=>{deleteFeedbacks(feedback.id)}} className="text-red-500 cursor-pointer hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Modal for Full Feedback */}
        {showModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Feedback Message</h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedFeedback.feedback_comment}
                </p>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <strong>Date:</strong> {new Date(selectedFeedback.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteFeedbacks(selectedFeedback.id);
                    setShowModal(false);
                    setSelectedFeedback(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feedback
