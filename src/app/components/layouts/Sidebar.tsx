"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'; 
import { auth } from '../../../utils/firebase'; 

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const tabs = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard/student' },
    { name: 'Courses', icon: '📚', path: '/dashboard/courses' },
    { name: 'Project', icon: '📝', path: '/dashboard/projects' },
    { name: 'Assessment', icon: '📂', path: '/dashboard/assignments' },
    { name: 'Freelance', icon: '💼', path: '/dashboard/freelancing' },
    { name: 'Hackathons', icon: '🏆', path: '/dashboard/hackathons' },
    { name: 'Blogs', icon: '✍️', path: '/dashboard/blogs' },
    { name: 'Help', icon: '❓', path: '/dashboard/help' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} bg-black text-white h-screen flex flex-col justify-between`}>
      {/* Logo */}
      <div className="logo-section p-6">
        <img src="/logo.png" alt="Company Logo" className="w-20 h-20 mx-auto" />
      </div>

      {/* Menu Items */}
      <ul className="menu flex-1 space-y-4">
        {tabs.map((tab) => (
          <li 
            key={tab.name} 
            className={`menu-item p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-700 rounded-lg ${router.pathname === tab.path ? 'bg-white text-black' : ''}`}
            onClick={() => router.push(tab.path)}
          >
            <span>{tab.icon}</span>
            {!isCollapsed && <span>{tab.name}</span>}
          </li>
        ))}
      </ul>

      {/* Profile Section */}
      <div className="profile-section p-6">
        <div className="flex items-center space-x-3">
          <img src="/profile-pic.png" alt="Profile" className="w-10 h-10 rounded-full" />
          {!isCollapsed && (
            <div>
              <span className="font-semibold">Yuvraj</span>
              <p className="text-gray-400 text-sm">Bengaluru</p>
            </div>
          )}
        </div>
        {/* Settings & Logout */}
        <div className="settings-logout mt-4 space-y-3">
          <button className="w-full flex items-center space-x-3 text-left hover:bg-gray-700 p-2 rounded-lg">
            <span>⚙️</span>
            {!isCollapsed && <span>Settings</span>}
          </button>
          <button 
            onClick={handleSignOut} 
            className="w-full flex items-center space-x-3 text-left hover:bg-gray-700 p-2 rounded-lg"
          >
            <span>🚪</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Collapse Button */}
      <button 
        className="collapse-btn bg-gray-800 text-white p-2 rounded-full mx-auto mb-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '▶️' : '◀️'}
      </button>
    </div>
  );
};

export default Sidebar;
