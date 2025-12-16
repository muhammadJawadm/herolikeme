import { useState, useEffect } from "react";
import Header from "../../layouts/partials/Header";
import { FiSearch, FiDownload, FiClock, FiCheck, FiX } from "react-icons/fi";
import {
  fetchDownloadRequests,
  updateRequestStatus,
  deleteDownloadRequest,
  type DownloadRequestWithUser,
} from "../../services/downloadRequestServices";
import { fetchUserById } from "../../services/usersServices";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DataDownloadRequests = () => {
  const [requests, setRequests] = useState<DownloadRequestWithUser[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DownloadRequestWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DownloadRequestWithUser | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const refreshRequests = async () => {
    setIsLoading(true);
    const data = await fetchDownloadRequests();
    setRequests(data);
    setFilteredRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, filterStatus, requests]);

  const openStatusModal = (request: DownloadRequestWithUser) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedRequest) return;

    const result = await updateRequestStatus(selectedRequest.id, newStatus);
    if (result) {
      await refreshRequests();
      setShowStatusModal(false);
      setSelectedRequest(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const success = await deleteDownloadRequest(id);
      if (success) {
        await refreshRequests();
      }
    }
  };

  const handleDownloadPDF = async (userId: string, userName?: string) => {
    try {
      // Fetch user data
      const userData = await fetchUserById(userId);
      if (!userData) {
        alert("Unable to fetch user data");
        return;
      }

      // Create PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add header with gradient background
      pdf.setFillColor(79, 70, 229); // Primary color
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Add title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('User Data Export', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // Reset text color for content
      pdf.setTextColor(0, 0, 0);
      
      let yPosition = 50;

      // Personal Information Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Personal Information', 14, yPosition);
      yPosition += 10;

      const personalInfo = [
        ['Name', userData.name || userData.first_name && userData.last_name ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : 'N/A'],
        ['Email', userData.email || 'N/A'],
        ['Gender', userData.user_profiles?.gender || 'N/A'],
        ['Date of Birth', userData.user_profiles?.dob ? new Date(userData.user_profiles.dob).toLocaleDateString() : 'N/A'],
        ['Country', userData.user_profiles?.country || 'N/A'],
        ['Zip Code', userData.user_profiles?.zip_code || 'N/A'],
        ['Address', userData.user_profiles?.address || 'N/A'],
        ['Language', userData.user_profiles?.language || 'N/A'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: personalInfo,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Account Information Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Account Information', 14, yPosition);
      yPosition += 10;

      const accountInfo = [
        ['User ID', userData.id],
        ['Login Via', userData.login_via || 'N/A'],
        ['Premium Status', userData.is_premium ? 'Yes' : 'No'],
        ['Profile Complete', userData.is_profile_complete ? 'Yes' : 'No'],
        ['Account Created', new Date(userData.created_at).toLocaleString()],
        ['Last Updated', new Date(userData.last_updated).toLocaleString()],
        ['Is Online', userData.is_online ? 'Yes' : 'No'],
        ['Last Seen', userData.last_seen ? new Date(userData.last_seen).toLocaleString() : 'N/A'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: accountInfo,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Profile Details Section
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Profile Details', 14, yPosition);
      yPosition += 10;

      const profileDetails = [
        ['Short Bio', userData.user_profiles?.short_bio || 'N/A'],
        ['Who to Meet', userData.user_profiles?.who_to_meet || 'N/A'],
        ['Your Goal', userData.user_profiles?.your_goal || 'N/A'],
        ['Max Distance', userData.user_profiles?.max_distance ? `${userData.user_profiles.max_distance} km` : 'N/A'],
        ['Age Range', userData.user_profiles?.age_range || 'N/A'],
        ['Measurement Unit', userData.user_profiles?.measurement_unit || 'N/A'],
        ['Whole World', userData.user_profiles?.is_whole_world ? 'Yes' : 'No'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: profileDetails,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Health Information Section
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Health Information', 14, yPosition);
      yPosition += 10;

      const healthInfo = [
        ['Cancer Status', userData.user_profiles?.is_cancer ? 'Yes' : 'No'],
        ['Other Chronic Condition', userData.user_profiles?.is_other_chronic ? 'Yes' : 'No'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: healthInfo,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;

      // Profile Images Section
      if (userData.user_profiles?.profile_images && userData.user_profiles.profile_images.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(79, 70, 229);
        pdf.text('Profile Images', 14, yPosition);
        yPosition += 10;

        // Load and add images
        const imagePromises = userData.user_profiles.profile_images.map(async (url) => {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error loading image:', error);
            return null;
          }
        });

        const loadedImages = await Promise.all(imagePromises);
        const validImages = loadedImages.filter((img): img is string => img !== null);

        if (validImages.length > 0) {
          const imgWidth = 80;
          const imgHeight = 80;
          const imagesPerRow = 2;
          const horizontalSpacing = 10;
          const verticalSpacing = 10;

          validImages.forEach((imgData, index) => {
            const row = Math.floor(index / imagesPerRow);
            const col = index % imagesPerRow;
            const xPos = 14 + col * (imgWidth + horizontalSpacing);
            const yPos = yPosition + row * (imgHeight + verticalSpacing);

            // Check if we need a new page
            if (yPos + imgHeight > pdf.internal.pageSize.getHeight() - 20) {
              pdf.addPage();
              yPosition = 20;
              return;
            }

            try {
              pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
              
              // Add image number label
              pdf.setFontSize(8);
              pdf.setTextColor(100, 100, 100);
              pdf.text(`Image ${index + 1}`, xPos + imgWidth / 2, yPos + imgHeight + 5, { align: 'center' });
              pdf.setTextColor(0, 0, 0);
            } catch (error) {
              console.error('Error adding image to PDF:', error);
            }
          });

          // Calculate final position after images
          const totalRows = Math.ceil(validImages.length / imagesPerRow);
          yPosition += totalRows * (imgHeight + verticalSpacing) + 15;
        } else {
          pdf.setFontSize(10);
          pdf.setTextColor(128, 128, 128);
          pdf.text('Unable to load profile images', 14, yPosition);
          yPosition += 15;
          pdf.setTextColor(0, 0, 0);
        }
      }

      // Interests Section
      if (userData.user_profiles?.interests && userData.user_profiles.interests.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(79, 70, 229);
        pdf.text('Interests', 14, yPosition);
        yPosition += 10;

        const interestsBody = userData.user_profiles.interests.map((interest, index) => [
          `${index + 1}`,
          interest
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [['#', 'Interest']],
          body: interestsBody,
          theme: 'striped',
          headStyles: { fillColor: [79, 70, 229] },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 14, right: 14 }
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }

      // Settings & Preferences Section
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Settings & Preferences', 14, yPosition);
      yPosition += 10;

      const settingsInfo = [
        ['FCM Enabled', userData.fcm_enabled ? 'Yes' : 'No'],
        ['Account Paused', userData.is_paused ? 'Yes' : 'No'],
        ['Show Last Active', userData.show_last_active ? 'Yes' : 'No'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: settingsInfo,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      // Add footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        pdf.text(
          'HeroZLikeMe - User Data Export',
          14,
          pdf.internal.pageSize.getHeight() - 10
        );
      }

      // Save PDF
      const fileName = `${(userName || 'User').replace(/\s+/g, '_')}_data_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FiClock className="w-3 h-3" />,
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <FiCheck className="w-3 h-3" />,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <FiX className="w-3 h-3" />,
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <FiDownload className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-semibold`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return requests.length;
    return requests.filter((req) => req.status === status).length;
  };

  return (
    <div>
      <Header header={"Data Download Requests"} link="" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{getStatusCount("pending")}</p>
              </div>
              <FiClock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-900">{getStatusCount("approved")}</p>
              </div>
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Completed</p>
                <p className="text-2xl font-bold text-blue-900">{getStatusCount("completed")}</p>
              </div>
              <FiDownload className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{getStatusCount("rejected")}</p>
              </div>
              <FiX className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg font-medium border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">User Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Country</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Requested At</th>
                  <th className="px-6 py-3">Updated At</th>
                  <th className="px-6 py-3">Download</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-gray-500">Loading requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="bg-white hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-gray-700 font-medium">{request.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {request.user_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{request.user_email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {request.country}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(request.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(request.updated_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDownloadPDF(request.uid, request.user_name)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-medium text-sm"
                        >
                          <FiDownload className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openStatusModal(request)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline mr-3 font-medium"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No download requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Update Request Status</h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>User:</strong> {selectedRequest.user_name}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {selectedRequest.user_email}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Country:</strong> {selectedRequest.country}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status <span className="text-red-500">*</span>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataDownloadRequests;
