import React from 'react';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState('Home');

  const menuItems = [
    { icon: 'bi-house-door', label: 'Home', path: '/' },
    { icon: 'bi-search', label: 'Search', path: '/search' },
    { icon: 'bi-compass', label: 'Explore', path: '/explore' },
    { icon: 'bi-film', label: 'Reels', path: '/reels' },
    { icon: 'bi-chat-dots', label: 'Messages', path: '/messages' },
    { icon: 'bi-heart', label: 'Notifications', path: '/notifications' },
    { icon: 'bi-plus-square', label: 'Create', path: '/create' },
    { icon: 'bi-person-circle', label: 'Profile', path: '/profile' }
  ];

  const bottomMenuItems = [
    { icon: 'bi-threads', label: 'Threads', path: '/threads' },
    { icon: 'bi-list', label: 'More', path: '/more' }
  ];

  const handleItemClick = (label, path) => {
    setActiveItem(label);
    navigate(path);
  };

  return (
    <div className='m-2 text-[1.0rem]'>
      <div className='flex flex-col gap-3 fixed'>
        <img 
          className='w-[100px] cursor-pointer' 
          src="src/assets/InstaText.png" 
          alt="Instagram logo featuring the word InstaText in a modern stylized font" 
          onClick={() => {
            setActiveItem('Home');
            navigate('/');
          }}
        />
        
        {menuItems.map((item) => (
          <div 
            key={item.label}
            className={`flex gap-1.5 items-center cursor-pointer p-1 rounded hover:bg-gray-100 ${activeItem === item.label ? 'font-semibold' : ''}`}
            onClick={() => handleItemClick(item.label, item.path)}
          >
            <i className={`bi ${item.icon} ${activeItem === item.label ? 'text-black' : ''}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className='flex flex-col gap-1 fixed bottom-0 mb-2'>
        {bottomMenuItems.map((item) => (
          <div 
            key={item.label}
            className={`flex gap-1.5 items-center cursor-pointer p-1 rounded hover:bg-gray-100 ${activeItem === item.label ? 'font-semibold' : ''}`}
            onClick={() => handleItemClick(item.label, item.path)}
          >
            <i className={`bi ${item.icon} ${activeItem === item.label ? 'text-black' : ''}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;