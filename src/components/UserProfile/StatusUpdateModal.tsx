import React from 'react';
import type { SelfieVerification } from '../../services/selfieVerificationServices';
import type { User } from '../../services/usersServices';

interface StatusUpdateModalProps {
  isOpen: boolean;
  selfieVerification: SelfieVerification | null;
  user: User | undefined;
  newStatus: 'pending' | 'verified' | 'rejected';
  adminNote: string;
  isUpdating: boolean;
  onClose: () => void;
  onStatusChange: (status: 'pending' | 'verified' | 'rejected') => void;
  onAdminNoteChange: (note: string) => void;
  onUpdate: () => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  selfieVerification,
  user,
  newStatus,
  adminNote,
  isUpdating,
  onClose,
  onStatusChange,
  onAdminNoteChange,
  onUpdate,
}) => {
  if (!isOpen || !selfieVerification) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Update Selfie Verification Status</h2>

        <div className="mb-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={selfieVerification.selfie_url}
              alt="Selfie"
              className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-sm text-gray-600">
                <strong>User:</strong> {user?.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value as 'pending' | 'verified' | 'rejected')}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isUpdating}
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Note (Optional)</label>
          <textarea
            value={adminNote}
            onChange={(e) => onAdminNoteChange(e.target.value)}
            placeholder="Add a note about this verification (e.g., reason for rejection)..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            disabled={isUpdating}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
