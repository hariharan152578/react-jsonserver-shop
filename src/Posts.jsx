import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Safe date formatter with validation
const formatPostTime = (dateString) => {
  try {
    if (!dateString) return "Just now";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date().getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  } catch (e) {
    return "Just now";
  }
};

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState(new Set());

    // Load persisted data from localStorage
    useEffect(() => {
        const savedLikes = JSON.parse(localStorage.getItem('likedPosts')) || [];
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts')) || [];
        setLikedPosts(new Set(savedLikes));
        setBookmarkedPosts(new Set(savedBookmarks));
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/posts');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                // Ensure each post has valid dates and comments
                const postsWithValidDates = data.map(post => ({
                    ...post,
                    timestamp: post.timestamp || post.createdAt || new Date().toISOString(),
                    comments: (post.comments || []).map(comment => ({
                        ...comment,
                        timestamp: comment.timestamp || comment.createdAt || new Date().toISOString()
                    }))
                }));
                setPosts(postsWithValidDates);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const newLiked = new Set(prev);
            if (newLiked.has(postId)) {
                newLiked.delete(postId);
            } else {
                newLiked.add(postId);
                // Add like animation effect
                const likeElement = document.getElementById(`like-heart-${postId}`);
                if (likeElement) {
                    likeElement.classList.add('animate-ping', 'scale-150');
                    setTimeout(() => {
                        likeElement.classList.remove('animate-ping', 'scale-150');
                    }, 500);
                }
            }
            localStorage.setItem('likedPosts', JSON.stringify(Array.from(newLiked)));
            return newLiked;
        });
    };

    const handleBookmark = (postId) => {
        setBookmarkedPosts(prev => {
            const newBookmarked = new Set(prev);
            if (newBookmarked.has(postId)) {
                newBookmarked.delete(postId);
            } else {
                newBookmarked.add(postId);
            }
            localStorage.setItem('bookmarkedPosts', JSON.stringify(Array.from(newBookmarked)));
            return newBookmarked;
        });
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const handleAddComment = (postId) => {
        if (!commentInputs[postId]?.trim()) return;

        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [
                        ...(post.comments || []),
                        {
                            id: Date.now(),
                            username: 'current_user',
                            text: commentInputs[postId],
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
            return post;
        }));

        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(postId)) {
                newExpanded.delete(postId);
            } else {
                newExpanded.add(postId);
            }
            return newExpanded;
        });
    };

    const handleDoubleClickLike = (postId) => {
        if (!likedPosts.has(postId)) {
            handleLike(postId);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-lg font-semibold text-red-500">
                <p>Error: {error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-lg font-semibold">
                <p>No posts found.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {posts.map((post) => (
                <div key={post.id} className="border rounded-lg shadow p-4 bg-white max-w-xl mx-auto">
                    {/* Header with user info and options */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.avatar || 'https://via.placeholder.com/150'}
                                className="rounded-full w-10 h-10 object-cover border"
                                alt={post.username}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150';
                                }}
                            />
                            <span className="font-semibold">{post.username || 'user'}</span>
                        </div>
                        <button aria-label="More options">
                            <i className="bi bi-three-dots text-xl"></i>
                        </button>
                    </div>

                    {/* Post image with double-click like */}
                    <div 
                        className="relative flex justify-center mb-2 cursor-pointer"
                        onDoubleClick={() => handleDoubleClickLike(post.id)}
                    >
                        <img
                            src={post.image || 'https://via.placeholder.com/500'}
                            alt={post.caption || 'Post image'}
                            className="rounded-lg max-h-[600px] w-full object-cover select-none"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500';
                            }}
                        />
                        <div 
                            id={`like-heart-${post.id}`}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
                            style={{ transition: 'opacity 0.3s' }}
                        >
                            <i className="bi bi-heart-fill text-red-500 text-8xl"></i>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between text-2xl mb-2">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handleLike(post.id)}
                                aria-label="Like"
                            >
                                <i 
                                    className={`bi ${likedPosts.has(post.id) ? 'bi-heart-fill text-red-500' : 'bi-heart'} p-1 hover:text-red-500 transition-colors`}
                                ></i>
                            </button>
                            <button 
                                aria-label="Comment"
                                onClick={() => {
                                    document.getElementById(`comment-input-${post.id}`)?.focus();
                                }}
                            >
                                <i className="bi bi-chat p-1 hover:text-blue-500 transition-colors"></i>
                            </button>
                            <button aria-label="Send">
                                <i className="bi bi-send p-1 hover:text-green-500 transition-colors"></i>
                            </button>
                        </div>
                        <button 
                            onClick={() => handleBookmark(post.id)}
                            aria-label="Bookmark"
                        >
                            <i 
                                className={`bi ${bookmarkedPosts.has(post.id) ? 'bi-bookmark-fill text-yellow-500' : 'bi-bookmark'} hover:text-yellow-500 transition-colors`}
                            ></i>
                        </button>
                    </div>

                    {/* Likes count */}
                    <div className="mb-1 text-gray-700">
                        <span className="font-medium">
                            {likedPosts.has(post.id) ? (post.likes || 0) + 1 : post.likes || 0} likes
                        </span>
                    </div>

                    {/* Caption */}
                    <div className="mb-1">
                        <p className="text-gray-800">
                            <span className="font-semibold mr-2">{post.username || 'user'}</span>
                            {post.caption || ''}
                        </p>
                    </div>

                    {/* View all comments */}
                    {post.comments?.length > 2 && !expandedComments.has(post.id) && (
                        <button 
                            onClick={() => toggleComments(post.id)}
                            className="text-gray-500 text-sm mb-1"
                        >
                            View all {post.comments.length} comments
                        </button>
                    )}

                    {/* Comments (limited or expanded) */}
                    <div className="space-y-1 mb-2">
                        {(post.comments || []).slice(0, expandedComments.has(post.id) ? post.comments?.length : 2).map(comment => (
                            <div key={comment.id} className="flex items-start">
                                <p className="text-gray-800">
                                    <span className="font-semibold mr-2">{comment.username || 'user'}</span>
                                    {comment.text}
                                </p>
                                <span className="ml-2 text-xs text-gray-400">
                                    {formatPostTime(comment.timestamp)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Post time */}
                    <div className="text-gray-400 text-xs mb-3">
                        {formatPostTime(post.timestamp)}
                    </div>

                    {/* Add comment */}
                    <div className="flex items-center border-t pt-3">
                        <input
                            id={`comment-input-${post.id}`}
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-grow outline-none"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button 
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className={`ml-2 font-semibold ${commentInputs[post.id]?.trim() ? 'text-blue-500' : 'text-blue-200'}`}
                        >
                            Post
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Posts;