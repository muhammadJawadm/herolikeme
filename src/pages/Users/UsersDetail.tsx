import { useEffect, useState } from "react";
import Header from "../../layouts/partials/Header";
import { fetchUserById } from '../../services/usersServices';
import type { User } from '../../services/usersServices';
import { useParams } from "react-router-dom";
import { 
  fetchSelfieVerificationByUserId, 
  updateSelfieVerificationStatus, 
  type SelfieVerification 
} from "../../services/selfieVerificationServices";
import ProfileHeader from "../../components/UserProfile/ProfileHeader";
import InfoCard from "../../components/UserProfile/InfoCard";
import SelfieVerificationSection from "../../components/UserProfile/SelfieVerificationSection";
import StatusUpdateModal from "../../components/UserProfile/StatusUpdateModal";
import GallerySection from "../../components/UserProfile/GallerySection";
import VoiceMessageSection from "../../components/UserProfile/VoiceMessageSection";



const UsersDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [selfieVerification, setSelfieVerification] = useState<SelfieVerification | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    // console.log("User ID from params:", id);
    const getUser = async () => {
      if (id) {
        const data = await fetchUserById(id);
        if (data) {
          setUser(data);
          console.log("Fetched user:", data);
        }
      }
    };
    
    const getSelfieVerification = async () => {
      if (id) {
        console.log("Fetching selfie verification for user ID:", id);
        const data = await fetchSelfieVerificationByUserId(id);
        console.log("Selfie verification data:", data);
        if (data) {
          setSelfieVerification(data);
          setAdminNote(data.admin_note || "");
        } else {
          console.log("No selfie verification found for this user");
          setSelfieVerification(null);
        }
      }
    };
    
    getUser();
    getSelfieVerification();
  }, [id]);
  
  const openStatusModal = () => {
    if (selfieVerification) {
      setNewStatus(selfieVerification.status);
      setAdminNote(selfieVerification.admin_note || "");
      setShowStatusModal(true);
    }
  };
  
  const handleStatusUpdate = async () => {
    if (!selfieVerification) return;
    
    setIsUpdating(true);
    const result = await updateSelfieVerificationStatus(
      selfieVerification.id,
      newStatus,
      adminNote
    );
    
    if (result) {
      setSelfieVerification(result);
      setShowStatusModal(false);
    }
    setIsUpdating(false);
  };
  
  const handleCloseModal = () => {
    setShowStatusModal(false);
    if (selfieVerification) {
      setNewStatus(selfieVerification.status);
      setAdminNote(selfieVerification.admin_note || "");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header header={"Manage Users"} link="" />
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Main Content */}
          <div className="p-6 md:p-8">
            {/* User Info Grid */}
             <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Bio
              </h3>
              <p className="text-gray-700 leading-relaxed">{user?.short_bio}</p>
            </div>

            {/* Interests Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Interests
              </h3>
              {user?.interests && user.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No interests added yet</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InfoCard label="First Name" value={user?.first_name} />
                <InfoCard label="Last Name" value={user?.last_name} />
                <InfoCard label="Date of Birth" value={user?.dob ? new Date(user.dob).toLocaleDateString() : undefined} />
                <InfoCard label="Login Via" value={user?.login_via || "email"} />
                <InfoCard label="Looking For" value={user?.who_to_meet} />
                <InfoCard label="Goal" value={user?.your_goal} />
                <InfoCard label="Country" value={user?.country} />
                <InfoCard label="Zip Code" value={user?.zip_code} />
                <InfoCard label="Address" value={user?.address} />
                <InfoCard label="Language" value={user?.language} />
                <InfoCard label="Measurement Unit" value={user?.measurement_unit} />
                <InfoCard label="Max Distance" value={user?.max_distance ? `${user.max_distance} miles` : undefined} />
                <InfoCard label="Search Whole World" value={user?.is_whole_world} />
                <InfoCard label="Impacted by Cancer" value={user?.is_cancer} />
                <InfoCard label="Impacted by Chronic Conditions" value={user?.is_other_chronic} />
                <InfoCard label="Show Last Active" value={user?.show_last_active} />
                <InfoCard label="FCM Notifications" value={user?.fcm_enabled} />
                <InfoCard label="Last Seen" value={user?.last_seen ? new Date(user.last_seen).toLocaleString() : undefined} />
                <InfoCard label="Account Created" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined} />
                <InfoCard label="Last Updated" value={user?.last_updated ? new Date(user.last_updated).toLocaleDateString() : undefined} />
              </div>
            </div>

            {/* Selfie Verification Section */}
            <SelfieVerificationSection
              selfieVerification={selfieVerification}
              onOpenStatusModal={openStatusModal}
            />

            {/* Gallery Section */}
            <GallerySection images={user?.profile_images} />

            {/* Voice Message Section */}
            <VoiceMessageSection audioUrl={user?.audio} />
          </div>
        </div>
      </div>
      
      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        selfieVerification={selfieVerification}
        user={user}
        newStatus={newStatus}
        adminNote={adminNote}
        isUpdating={isUpdating}
        onClose={handleCloseModal}
        onStatusChange={setNewStatus}
        onAdminNoteChange={setAdminNote}
        onUpdate={handleStatusUpdate}
      />
    </div>
  )
}

export default UsersDetail
