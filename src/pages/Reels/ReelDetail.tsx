
import Header from '../../layouts/partials/Header'

const ReelDetail = () => {
     const reel  = {

      id: 1,
      username: "cleanlife_official",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      videoUrl: "https://videos.pexels.com/video-files/32088276/13678304_1080_1920_24fps.mp4",
      caption: "30-second cleaning hack you NEED to know! 🧼✨ #Reels #CleaningHacks",
      likes: 12453,
      shares: 2312,
      comments: 589,
      views: 150432,
      duration: "0:30",
      timestamp: "2 hours ago",
      location: "San Francisco, CA",
      music: "Original Sound - CleanLife",
      saves: 5432,
      reach: 250000,
      engagementRate: 8.7
    
  
}
  return (
  
       <div>
      <Header header={"Manage Reels"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
 
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black rounded-lg overflow-hidden">
          <video 
            src={reel.videoUrl}
            controls
            className="w-full aspect-80 h-80 object-cover"
          />
        </div>
        
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={reel.userAvatar}
              alt={reel.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200/50"
            />
            <div>
              <h2 className="font-bold text-gray-800">{reel.username}</h2>
              {reel.location && (
                <p className="text-sm text-gray-500">{reel.location}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-800 mb-2">{reel.caption}</p>
            {reel.music && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Music:</span> {reel.music}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.views.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Views</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.likes.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Likes</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.comments.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.shares.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Shares</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.reach.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Reach</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{reel.engagementRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ReelDetail
