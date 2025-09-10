
import { Link } from 'react-router-dom';
import Header from '../../layouts/partials/Header';
interface Reel {
  id: number;
  username: string;
  userAvatar: string;
  videoUrl: string;
  caption: string;
  likes: number;
  shares: number;
  comments: number;
  views: number;
  timestamp: string;
  duration: string;
  music?: string;
  location?: string;
  saves: number;
  reach: number;
  engagementRate: number;
}

const Reels = () => {
 const reelsData: Reel[] = [
    {
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
    },
    {
      id: 2,
      username: "fitwithamy",
      userAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      videoUrl: "https://videos.pexels.com/video-files/32088276/13678304_1080_1920_24fps.mp4",
      caption: "Full body workout in 15 seconds! 💪 #FitnessReels #QuickWorkout",
      likes: 28765,
      shares: 5243,
      comments: 1421,
      views: 890123,
      duration: "0:15",
      timestamp: "1 day ago",
      music: "Popular Song - Artist",
      saves: 12432,
      reach: 1200000,
      engagementRate: 9.2
    },
    {
      id: 3,
      username: "foodie_adventures",
      userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
      videoUrl: "https://videos.pexels.com/video-files/32088276/13678304_1080_1920_24fps.mp4",
      caption: "3-ingredient dessert that will blow your mind! 🍫 #FoodReels #EasyRecipes",
      likes: 54321,
      shares: 9876,
      comments: 2213,
      views: 2100432,
      duration: "0:45",
      timestamp: "3 days ago",
      music: "Cooking Vibes - Soundtrack",
      saves: 25432,
      reach: 3500000,
      engagementRate: 7.8
    }
  ];
  return (
 <div>
      <Header header={"Reels Dashboard"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">

        <div className="my-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Reels</h2>
          
          </div>
          
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Preview</th>
                  <th className="px-6 py-3">Views</th>
                  <th className="px-6 py-3">Engagement</th>
                  <th className="px-6 py-3">Posted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {reelsData?.map((reel) => (
                  <tr
                    key={reel.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={reel.userAvatar}
                          alt={reel.username}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                        />
                        <span className="font-medium text-gray-800">
                          {reel.username}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <video 
                            src={reel.videoUrl}
                            className="w-16 h-24 rounded-md object-cover bg-gray-200"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {reel.duration}
                          </div>
                        </div>
                        <div className="max-w-xs">
                          <p className="text-gray-800 line-clamp-1 text-sm">
                            {reel.caption}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-800">
                        {reel.views.toLocaleString()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-800">
                        {reel.engagementRate.toFixed(1)}%
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700/90">
                        {reel.timestamp}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/reels/${reel.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200 transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reels
