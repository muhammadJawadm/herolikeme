import { useEffect, useState } from "react";
import Header from "../../layouts/partials/Header";
import { fetchUserById } from '../../services/usersServices';
import type { User } from '../../services/usersServices';
import { useParams } from "react-router-dom";
import ProfileHeader from "../../components/UserProfile/ProfileHeader";
import InfoCard from "../../components/UserProfile/InfoCard";
import GallerySection from "../../components/UserProfile/GallerySection";
import VoiceMessageSection from "../../components/UserProfile/VoiceMessageSection";
import { fetchMutualMatches, type MutualMatch } from "../../services/userLikesServices";
import { FaHeart } from "react-icons/fa";



const UsersDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [mutualMatches, setMutualMatches] = useState<MutualMatch[]>([]);

  useEffect(() => {
    const getUser = async () => {
      if (id) {
        const data = await fetchUserById(id);
        if (data) {
          setUser(data);
          console.log("Fetched user:", data);
        }
      }
    };

    const getMatches = async () => {
      if (id) {
        const matches = await fetchMutualMatches(id);
        setMutualMatches(matches);
        console.log("Mutual matches:", matches);
      }
    };

    getUser();
    getMatches();
  }, [id]);




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
              <p className="text-gray-700 leading-relaxed">{user?.user_profiles?.short_bio}</p>
            </div>

            {/* Interests Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Interests
              </h3>
              {user?.user_profiles?.interests && user.user_profiles?.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.user_profiles.interests.map((interest: string, index: number) => (
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
                <InfoCard label="Date of Birth" value={user?.user_profiles?.dob ? new Date(user.user_profiles.dob).toLocaleDateString() : undefined} />
                <InfoCard label="Login Via" value={user?.login_via || "email"} />
                <InfoCard label="Looking For" value={Array.isArray(user?.user_profiles?.who_to_meet) ? user.user_profiles.who_to_meet.join(', ') : user?.user_profiles?.who_to_meet} />
                <InfoCard label="Goal" value={user?.user_profiles?.your_goal} />
                <InfoCard label="Country" value={user?.user_profiles?.country} />
                <InfoCard label="Zip Code" value={user?.user_profiles?.zip_code} />
                <InfoCard label="Address" value={user?.user_profiles?.address} />
                <InfoCard label="Language" value={user?.user_profiles?.language} />
                <InfoCard label="Measurement Unit" value={user?.user_profiles?.measurement_unit} />
                <InfoCard label="Max Distance" value={user?.user_profiles?.max_distance ? `${user.user_profiles.max_distance} miles` : undefined} />
                <InfoCard label="Search Whole World" value={user?.user_profiles?.is_whole_world} />
                <InfoCard label="Impacted by Cancer" value={user?.user_profiles?.is_cancer} />
                <InfoCard label="Impacted by Chronic Conditions" value={user?.user_profiles?.is_other_chronic} />
                <InfoCard label="Show Last Active" value={user?.show_last_active} />
                <InfoCard label="FCM Notifications" value={user?.fcm_enabled} />
                <InfoCard label="Last Seen" value={user?.last_seen ? new Date(user.last_seen).toLocaleString() : undefined} />
                <InfoCard label="Account Created" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : undefined} />
                <InfoCard label="Last Updated" value={user?.last_updated ? new Date(user.last_updated).toLocaleDateString() : undefined} />
              </div>
            </div>

            {/* Mutual Matches Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Mutual Matches
              </h3>

              {/* Match Count Card */}
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium mb-1">Total Matches</p>
                    <h3 className="text-4xl font-bold">{mutualMatches.length}</h3>
                  </div>
                  <div className="bg-white/20 rounded-full p-4">
                    <FaHeart className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Matched Users List */}
              {mutualMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mutualMatches.map((match) => (
                    <div
                      key={match.userId}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            match.user?.user_profiles?.profile_images?.[0] ||
                            '/placeholder-avatar.png'
                          }
                          alt={match.user?.name || 'User'}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">
                            {match.user?.name ||
                              `${match.user?.first_name || ''} ${match.user?.last_name || ''}`.trim() ||
                              'Unknown User'}
                          </h4>
                          <p className="text-sm text-gray-500">{match.user?.email || 'No email'}</p>
                        </div>
                        <FaHeart className="text-pink-500 w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FaHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No mutual matches yet</p>
                </div>
              )}
            </div>

            {/* Gallery Section */}
            <GallerySection images={user?.user_profiles?.profile_images} />

            {/* Voice Message Section */}
            <VoiceMessageSection audioUrl={user?.user_profiles?.audio} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersDetail
