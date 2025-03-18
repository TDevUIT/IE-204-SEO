"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaBookmark, FaTag, FaUsers, 
  FaRegClock, FaHeart, FaTimes, FaBars,
  FaPlus, FaComments, FaFolderOpen
} from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from '@/section/Navbar';
import { useIsMobile } from '@/hook/use-mobile';
import { useOpenAppSidebar } from '@/hook/use-app-sidebar';
import { AUTH_ROUTES } from '@/lib/route';
import NewsMarquee from '@/section/NewsMarquee';
import Footer from '@/components/Footer';
import { colors, theme } from '@/constants/colors';

const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const {isOpenAppSidebar, setIsOpenAppSidebar} = useOpenAppSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpenAppSidebar && sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node)) {
            setIsOpenAppSidebar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenAppSidebar, isMobile]);

  const menuSections = [
    {
      title: "Menu",
      items: [
        { name: "Home", icon: <FaHome />, href: "/" },
      ]
    },
    {
      title: "Bookmarks",
      items: [
        { name: "Quick saves", icon: <FaBookmark />, href: "/bookmarks/quick-saves" },
        { name: "Read it later", icon: <FaRegClock />, href: "/bookmarks/read-later" },
        { name: "Likes", icon: <FaHeart />, href: "/bookmarks/likes" },
      ]
    }
  ];

  return (
    <>
      {isAuthRoute ? 
      (
        <div>{children}</div>
      ) : 
      (
        <section className='flex flex-1'>
          {isMobile && isOpenAppSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={() => setIsOpenAppSidebar(false)}
            />
          )}

          <aside
            ref={sidebarRef}
            className={cn(
              'h-full border-r-2 border-black/70 fixed bg-background transition-all duration-300 z-50',
              isOpenAppSidebar ? (isMobile ? 'w-full bg-white' : 'w-64') : 'w-20'
            )}
            style={{ backgroundColor: theme.sidebar.background }}
          >
            {!isOpenAppSidebar && (
              <div className='h-full flex flex-col items-center justify-between py-6'>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpenAppSidebar(true)}
                    style={{ color: colors.text.secondary }}
                    className="hover:bg-opacity-100"
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.hover;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <FaBars className='h-6 w-6' />
                  </Button>

                  <div className='-rotate-90 whitespace-nowrap'>
                    <h1 className='font-bold text-4xl' style={{ color: theme.sidebar.text }}>Bloai</h1>
                  </div>

                  <div className='flex flex-col gap-5'>
                    <FaComments className='h-6 w-6 cursor-pointer' style={{ color: colors.text.secondary }} />
                    <FaFolderOpen className='h-6 w-6 cursor-pointer' style={{ color: colors.text.secondary }} />
                    <FaBookmark className='h-6 w-6 cursor-pointer' style={{ color: colors.text.secondary }} />
                  </div>
              </div>
            )}

            {isOpenAppSidebar && (
              <div className='h-full flex flex-col p-4'>
                <div className='flex justify-between items-center mb-6'>
                  <Link href="/" className='font-bold text-xl' style={{ color: theme.sidebar.text }}>
                    Bloai
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpenAppSidebar(false)}
                    style={{ color: colors.text.secondary }}
                    className="hover:bg-opacity-100"
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.hover;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <FaTimes className='h-6 w-6' />
                  </Button>
                </div>

                <Link href='/new-post'>
                  <Button 
                    className='w-full mb-6 gap-2 hover:opacity-90'
                    style={{ 
                      backgroundColor: colors.primary[600],
                      color: colors.text.white
                    }}
                  >
                    <FaPlus className='text-sm' />
                    <span>New Blog</span>
                  </Button>
                </Link>

                {menuSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className='mb-6'>
                    <h3 className='text-sm font-medium mb-3 px-2' style={{ color: colors.text.muted }}>
                      {section.title}
                    </h3>
                    <ul className='space-y-1'>
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          {item.href ? (
                            <Button
                              variant="ghost"
                              className='w-full justify-start gap-3'
                              style={{ 
                                backgroundColor: pathname === item.href ? colors.primary[50] : 'transparent',
                                color: pathname === item.href ? colors.primary[600] : theme.sidebar.text,
                              }}
                              onMouseOver={(e) => {
                                if (pathname !== item.href) {
                                  e.currentTarget.style.backgroundColor = theme.sidebar.hoverBg;
                                }
                              }}
                              onMouseOut={(e) => {
                                if (pathname !== item.href) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                              asChild
                            >
                              <Link href={item.href}>
                                <span style={{ 
                                  color: pathname === item.href ? colors.primary[600] : theme.sidebar.iconColor 
                                }}>
                                  {item.icon}
                                </span>
                                {item.name}
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              className='w-full justify-start gap-3'
                              style={{ color: theme.sidebar.text }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = theme.sidebar.hoverBg;
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <span style={{ color: theme.sidebar.iconColor }}>{item.icon}</span>
                              {item.name}
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main className={cn(
            'transition-margin duration-300',
            isMobile ? 
              (isOpenAppSidebar ? 'ml-0' : 'ml-20') : 
              (isOpenAppSidebar ? 'ml-64' : 'ml-20')
          )}>
            <div className='h-14'> 
              <Navbar />
            </div>
            <div className='w-full overflow-y-hidden'>
              <NewsMarquee />
            </div>
            {children}
            <Footer />
          </main>
        </section>
      )
      }
    </>
  );
};

export default AppSidebarProvider;