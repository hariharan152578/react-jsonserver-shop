import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, MessageSquare, X } from 'react-feather';

export const ViewStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId, tot: paramTot } = useParams();
  const id = Number(paramId);
  const tot = Number(paramTot);

  // Check if user came from stories feed
  useEffect(() => {
    if (!location.state?.fromStories) {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  // Auto-advance timer duration (ms)
  const STORY_DURATION = 8000;

  useEffect(() => {
    if (!id || !tot || id > tot || id <= 0) {
      navigate('/');
      return;
    }

    setLoading(true);
    fetch(`http://localhost:3000/stories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch story');
        return res.json();
      })
      .then((data) => {
        setStory(data);
        setError(null);
        // Reset interactions when story changes
        setLiked(false);
        setSaved(false);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, tot, navigate]);

  // Progress bar and auto-advance
  useEffect(() => {
    setProgress(0);
    if (!loading && !error && !isPaused) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current);
            handleNext();
            return 100;
          }
          return prev + 100 / (STORY_DURATION / 100);
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [id, loading, error, isPaused]);

  // Keyboard and touch navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') navigate('/');
      if (e.key === ' ') setIsPaused(prev => !prev);
    };
    
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [id, tot, navigate]);

  const handleNext = () => {
    if (id < tot) {
      navigate(`/story/${id + 1}/${tot}`, { state: { fromStories: true } });
    } else {
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (id > 1) {
      navigate(`/story/${id - 1}/${tot}`, { state: { fromStories: true } });
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
    setShowInteractions(false);
  };

  const handleInteraction = (type) => {
    switch (type) {
      case 'like':
        setLiked(prev => !prev);
        // Send like to API
        break;
      case 'save':
        setSaved(prev => !prev);
        // Send save to API
        break;
      case 'comment':
        // Open comment modal
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white text-black rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden"
      onMouseEnter={() => setShowInteractions(true)}
      onMouseLeave={() => setShowInteractions(false)}
      onTouchStart={() => setShowInteractions(true)}
    >
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 z-10">
        <motion.div 
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: STORY_DURATION / 1000, ease: 'linear' }}
        />
      </div>

      {/* Close button */}
      <button 
        onClick={() => { console.log('Navigating to / with replace'); navigate('/'); }}
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-white/20 transition"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            className="max-h-screen max-w-full object-contain"
            src={story.image}
            alt={story.title || 'Story image'}
            draggable={false}
            onClick={togglePause}
          />

          {/* Story info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
            <div className="flex items-center mb-3">
              <img 
                className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover mr-3"
                src={story.avatar} 
                alt={story.username || 'User avatar'}
              />
              <span className="font-semibold">{story.username}</span>
            </div>
            {story.title && (
              <h2 className="text-xl font-bold mb-2">{story.title}</h2>
            )}
            {story.description && (
              <p className="text-gray-300">{story.description}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="absolute inset-0 flex items-center justify-between z-10">
        <div 
          className="h-full w-1/2"
          onClick={handlePrevious}
          onTouchStart={handlePrevious}
        />
        <div 
          className="h-full w-1/2"
          onClick={handleNext}
          onTouchStart={handleNext}
        />
      </div>

      {/* Interaction buttons */}
      <AnimatePresence>
        {showInteractions && (
          <motion.div 
            className="absolute right-4 bottom-20 flex flex-col space-y-4 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <button
              onClick={() => handleInteraction('like')}
              className="p-2 rounded-full bg-black/50 hover:bg-white/20 transition"
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart 
                size={24} 
                fill={liked ? 'white' : 'none'} 
                color={liked ? 'white' : 'white'} 
              />
            </button>
            <button
              onClick={() => handleInteraction('save')}
              className="p-2 rounded-full bg-black/50 hover:bg-white/20 transition"
              aria-label={saved ? 'Unsave' : 'Save'}
            >
              <Bookmark 
                size={24} 
                fill={saved ? 'white' : 'none'} 
                color={saved ? 'white' : 'white'} 
              />
            </button>
            <button
              onClick={() => handleInteraction('comment')}
              className="p-2 rounded-full bg-black/50 hover:bg-white/20 transition"
              aria-label="Comment"
            >
              <MessageSquare size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-xl font-bold">Paused</div>
        </div>
      )}

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center space-x-4 z-10">
        {id > 1 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm"
          >
            Previous
          </button>
        )}
        {id < tot ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};