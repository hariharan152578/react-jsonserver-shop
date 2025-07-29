import React, { useEffect, useState } from 'react';
import { FiMoreHorizontal, FiChevronDown } from 'react-icons/fi';
import { BsCheck, BsPersonAdd } from 'react-icons/bs';

function Suggestions() {
  const [profiles, setProfiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState({ 
    profiles: true, 
    suggestions: true 
  });
  const [error, setError] = useState({ 
    profiles: null, 
    suggestions: null 
  });
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data fetch - replace with actual API calls
        const mockProfiles = [
          {
            id: 1,
            username: "your_profile",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            isCurrent: true
          },
          {
            id: 2,
            username: "travel_enthusiast",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          }
        ];

        const mockSuggestions = [
          {
            id: 101,
            username: "food_explorer",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            mutual: "Followed by user123 + 3 more"
          },
          {
            id: 102,
            username: "fitness_guru",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            mutual: "New to Instagram"
          },
          {
            id: 103,
            username: "photography_lover",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg",
            mutual: "Followed by friend_user"
          }
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProfiles(mockProfiles);
        setSuggestions(mockSuggestions);
        setError({ profiles: null, suggestions: null });
      } catch (err) {
        console.error('Fetch error:', err);
        setError({
          profiles: err.message.includes('profiles') ? err.message : null,
          suggestions: err.message.includes('suggestions') ? err.message : null
        });
      } finally {
        setIsLoading({ profiles: false, suggestions: false });
      }
    };

    fetchData();
  }, []);

  const handleFollow = (id) => {
    setFollowing(prev => {
      const newFollowing = new Set(prev);
      if (newFollowing.has(id)) {
        newFollowing.delete(id);
      } else {
        newFollowing.add(id);
      }
      return newFollowing;
    });
  };

  const handleSwitch = (id) => {
    console.log(`Switching to profile ${id}`);
    // Add your actual switch logic here
  };

  return (
    <div className="w-full max-w-[350px] px-4 py-6 hidden md:block">
      {/* Current Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://randomuser.me/api/portraits/women/44.jpg" 
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <p className="font-semibold text-sm">your_username</p>
            <p className="text-gray-400 text-sm">Your profile</p>
          </div>
        </div>
        <button className="text-blue-500 text-xs font-semibold">
          Switch
        </button>
      </div>

      {/* Suggestions Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 font-semibold text-sm">Suggestions For You</p>
        <button className="text-xs font-semibold">See All</button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggest) => (
          <div key={suggest.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={suggest.avatar} 
                  alt={suggest.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">{suggest.username}</p>
                <p className="text-xs text-gray-400">{suggest.mutual}</p>
              </div>
            </div>
            <button 
              onClick={() => handleFollow(suggest.id)}
              className={`text-xs font-semibold ${
                following.has(suggest.id) ? 'text-gray-800' : 'text-blue-500'
              }`}
            >
              {following.has(suggest.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-xs text-gray-400">
        <div className="flex flex-wrap gap-2 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Press</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Locations</a>
        </div>
        <p>© {new Date().getFullYear()} INSTAGRAM CLONE</p>
      </div>
    </div>
  );
}

export default Suggestions;