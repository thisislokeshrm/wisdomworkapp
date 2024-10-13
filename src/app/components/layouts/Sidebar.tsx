// src/components/layouts/Sidebar.tsx
"use client";

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { signOut } from 'firebase/auth'; 
import { auth } from '../../../utils/firebase'; 

interface SidebarProps {
  tabs: { name: string; path: string; icon: ReactElement<any, string | JSXElementConstructor<any>> | string | number | bigint | boolean | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }[];
  profilePic: string;
  userName: string;
  userLocation: string;
  logoSrc: string;
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, profilePic, userName, userLocation, logoSrc }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route pathname

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} bg-black text-white h-screen flex flex-col justify-between`}>
      {/* Logo Section */}
      <div className="logo-section p-6">
        <img src={logoSrc || '/assets/images/logo.png'} alt="Logo" className="w-auto h-auto mx-auto" />
      </div>

      {/* Menu Items */}
      <ul className="menu flex-1 space-y-4">
        {tabs.map((tab: { name: string; path: string; icon: ReactElement<any, string | JSXElementConstructor<any>> | string | number | bigint | boolean | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
          <li 
            key={tab.name} 
            className={`menu-item p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-700 rounded-lg ${pathname === tab.path ? 'bg-white text-black' : ''}`} // Compare pathname instead of asPath
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
          <img src={profilePic || '/default-profile-pic.png'} alt="Profile" className="w-10 h-10 rounded-full" />
          {!isCollapsed && (
            <div>
              <span className="font-semibold">{userName || 'Guest'}</span>
              <p className="text-gray-400 text-sm">{userLocation || 'Unknown Location'}</p>
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
