import React from 'react';
import { FiImage, FiCheck, FiX, FiClock } from 'react-icons/fi';
import type { SelfieVerification } from '../../services/selfieVerificationServices';

interface SelfieVerificationSectionProps {
  selfieVerification: SelfieVerification | null;
  onOpenStatusModal: () => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FiClock /> },
    verified: { bg: 'bg-green-100', text: 'text-green-800', icon: <FiCheck /> },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: <FiX /> },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-semibold`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const SelfieVerificationSection: React.FC<SelfieVerificationSectionProps> = ({
  selfieVerification,
  onOpenStatusModal,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
        <FiImage className="text-primary" />
        Selfie Verification
      </h3>

      {selfieVerification ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selfie Image */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Selfie Image</h4>
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <img
                src={selfieVerification.selfie_url}
                alt="Selfie Verification"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(selfieVerification.status)}
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Verification Details</h4>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600 font-medium">Status</span>
                  {getStatusBadge(selfieVerification.status)}
                </div>

                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600 font-medium">Submitted At</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(selfieVerification.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-sm text-gray-600 font-medium">Last Updated</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(selfieVerification.updated_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {selfieVerification.admin_note && (
                  <div className="pt-2">
                    <span className="text-sm text-gray-600 font-medium block mb-2">Admin Note</span>
                    <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm">
                      {selfieVerification.admin_note}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {selfieVerification.status === 'pending' ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiClock className="text-yellow-600 text-lg" />
                  <span className="text-sm font-semibold text-yellow-800">Pending Review</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">This selfie verification is waiting for admin approval.</p>
                <button
                  onClick={onOpenStatusModal}
                  className="w-full px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Review & Update Status
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenStatusModal}
                className="w-full px-4 py-3 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-200"
              >
                Update Verification Status
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FiImage className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No Selfie Verification Submitted</h4>
            <p className="text-gray-500 text-sm">This user has not submitted a selfie for verification yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfieVerificationSection;
