
import Header from "../../layouts/partials/Header";

interface SocialMediaPost {
  id: number;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: string;
  location?: string;
}

const Posts = () => {
let postsData: SocialMediaPost[] = [
  {
    id: 1,
    username: "cleanlife_official",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1600",
    caption: "Just dropped our ultimate cleaning guide! 🧼✨",
    likes: 2453,
    shares: 312,
    comments: 89,
    timestamp: "2 hours ago",
    location: "San Francisco, CA"
  },
  {
    id: 2,
    username: "homeimprovement_diy",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    image: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1600",
    caption: "Sneak peek of our upcoming home maintenance series... Who's excited? 🛠️ ",
    likes: 0,
    shares: 0,
    comments: 0,
    timestamp: "Draft - not published"
  },
  {
    id: 3,
    username: "fitwithamy",
    userAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600",
    caption: "Throwback to my original 12-week program that started it all! 💪",
    likes: 8765,
    shares: 1243,
    comments: 421,
    timestamp: "1 year ago"
  },
  {
    id: 4,
    username: "techguru",
    userAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1600",
    caption: "Tech support made simple! Check out my latest tutorial series in bio. #TechTips #ITSupport",
    likes: 4321,
    shares: 876,
    comments: 213,
    timestamp: "5 days ago",
    location: "Silicon Valley"
  },
  {
    id: 5,
    username: "businessconsultant",
    userAvatar: "https://randomuser.me/api/portraits/women/90.jpg",
    image: "https://images.pexels.com/photos/6621339/pexels-photo-6621339.jpeg?auto=compress&cs=tinysrgb&w=1600",
    caption: "Working on a new business strategy guide - what topics would you like covered? #BusinessGrowth #EntrepreneurLife",
    likes: 0,
    shares: 0,
    comments: 0,
    timestamp: "Draft - not published"
  }
]

  return (
    <div>
  <Header header={"Manage Social Posts"} link='' />
  <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
    <div className="my-3">
      <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
        <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
          <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Post Preview</th>
              <th className="px-6 py-3">Engagement</th>
              <th className="px-6 py-3">Posted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60">
            {postsData?.map((post) => (
              <tr
                key={post.id}
                className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                    />
                    <div>
                      <span className="block font-medium text-gray-800">
                        {post.username}
                      </span>
                      {post.location && (
                        <span className="block text-xs text-gray-500">
                          {post.location}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="max-w-xs">
                      <p className="text-gray-800 line-clamp-2">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{post.likes}</div>
                      <div className="text-xs text-gray-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{post.comments}</div>
                      <div className="text-xs text-gray-500">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{post.shares}</div>
                      <div className="text-xs text-gray-500">Shares</div>
                    </div>
                  </div>
                </td>
                
               
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-700/90">
                    {post.timestamp}
                  </span>
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

export default Posts
