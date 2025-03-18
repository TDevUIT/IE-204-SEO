'use client'
import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import { useOpenAppSidebar } from '@/hook/use-app-sidebar';
import Image from 'next/image';

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {isOpenAppSidebar} = useOpenAppSidebar();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={cn("sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2.5 transition-all", 
      isOpenAppSidebar ? "lg:pl-64" : "")}>
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600"></span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Tìm kiếm bài viết..."
            />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-3">
          {/* Search icon on mobile */}
          <button className="md:hidden p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <FaSearch className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
          </button>

          {/* Notification icon */}
          <button className="p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
          </button>

          {/* User profile or Auth buttons */}
          {user ? (
            // Người dùng đã đăng nhập - hiển thị avatar và dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 rounded-full overflow-hidden border-2 border-gray-200">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[100px]">
                  {user.name}
                </span>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaCog className="w-4 h-4 mr-3 text-gray-400" />
                      Settings
                    </Link>
                  </div>
                  <div className="py-1">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Sign out</span>
                    </div>
                  </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Người dùng chưa đăng nhập - hiển thị nút đăng nhập/đăng ký
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="hidden sm:inline-block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
              {/* Icon cho mobile */}
              <Link
                href="/auth/signin"
                className="sm:hidden p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaUser className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;