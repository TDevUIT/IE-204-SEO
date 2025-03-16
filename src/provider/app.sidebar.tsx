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
const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const {isOpenAppSidebar, setIsOpenAppSidebar} = useOpenAppSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

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
        { name: "Following", icon: <FaUsers /> },
        { name: "Tags", icon: <FaTag /> },
      ]
    },
    {
      title: "Bookmarks",
      items: [
        { name: "Quick saves", icon: <FaBookmark /> },
        { name: "Read it later", icon: <FaRegClock /> },
        { name: "Likes", icon: <FaHeart /> },
      ]
    }
  ];

  return (
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
          'h-screen border-r-2 border-black/70 fixed bg-background transition-all duration-300 z-50 bg-white',
          isOpenAppSidebar ? (isMobile ? 'w-full bg-white' : 'w-64') : 'w-20'
        )}
      >
        {!isOpenAppSidebar && (
          <div className='h-full flex flex-col items-center justify-between py-6'>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpenAppSidebar(true)}
              >
                <FaBars className='h-6 w-6' />
              </Button>

              <div className='-rotate-90 whitespace-nowrap'>
                <h1 className='font-bold text-4xl'>Bioai</h1>
              </div>

              <div className='flex flex-col gap-5'>
                <FaComments className='h-6 w-6 cursor-pointer' />
                <FaFolderOpen className='h-6 w-6 cursor-pointer' />
                <FaBookmark className='h-6 w-6 cursor-pointer' />
              </div>
          </div>
        )}

        {isOpenAppSidebar && (
          <div className='h-full flex flex-col p-4'>
             <div className='h-full flex flex-col p-4'>
            <div className='flex justify-between items-center mb-6'>
              <Link href="/" className='font-bold text-xl'>
                Bioai
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpenAppSidebar(false)}
              >
                <FaTimes className='h-6 w-6' />
              </Button>
            </div>

            <Link href='/new-post'>
              <Button className='w-full mb-6 gap-2'>
                <FaPlus className='text-sm' />
                <span>New Blog</span>
              </Button>
            </Link>

            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className='mb-6'>
                <h3 className='text-sm font-medium text-muted-foreground mb-3 px-2'>
                  {section.title}
                </h3>
                <ul className='space-y-1'>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.href ? (
                        <Button
                          variant={pathname === item.href ? "secondary" : "ghost"}
                          className='w-full justify-start gap-3'
                          asChild
                        >
                          <Link href={item.href}>
                            {item.icon}
                            {item.name}
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className='w-full justify-start gap-3'
                        >
                          {item.icon}
                          {item.name}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </div>
        )}
      </aside>

      <main className={cn(
        'transition-margin duration-300',
        isMobile ? 
          (isOpenAppSidebar ? 'ml-0' : 'ml-20') : 
          (isOpenAppSidebar ? 'ml-64' : 'ml-20')
      )}>
        <Navbar />
        <div className='h-14 w-[calc(100%-80px)]'/>
        {children}
      </main>
    </section>
  );
};

export default AppSidebarProvider;