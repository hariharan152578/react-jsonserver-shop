import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Stories() {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/stories')
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (id, total) => {
    navigate(`/story/${id}/${total}`, {
      state: { fromStories: true }
    });
  };

  return (
    <>
      {stories.length > 0 ? (
        <div className="flex items-center space-x-4 p-4 overflow-x-auto hide-scrollbar">
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center w-[60px]">
              <img
                src={story.avatar}
                alt={story.username}
                className="w-[50px] h-[50px] rounded-full border-2 border-pink-500 object-cover"
                onClick={() => handleClick(story.id, stories.length)}
              />
              <p className="truncate w-[60px] text-center text-xs mt-1">
                {story.username}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading stories...</p>
      )}
    </>
  );
}

export default Stories;
