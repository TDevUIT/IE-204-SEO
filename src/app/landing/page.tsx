"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';
import { useCurrentUser } from '@/hook/use-current-user';

const LandingPage = () => {
  const [randomImage, setRandomImage] = useState('');
  const user = useCurrentUser();

  useEffect(() => {
    setRandomImage(`https://picsum.photos/600/400?random=10)}`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Chia sẻ kiến thức, <br />
              <span className="text-blue-600">Kết nối cộng đồng</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Nền tảng blog dành cho developer, nơi bạn có thể chia sẻ kiến thức, 
              kinh nghiệm và kết nối với cộng đồng lập trình viên.
            </p>
            
            {user ? (
              // Người dùng đã đăng nhập - hiển thị nút bắt đầu viết blog
              <Link 
                href="/dashboard/new-post" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Bắt đầu viết blog
                <FaArrowRight />
              </Link>
            ) : (
              // Người dùng chưa đăng nhập - hiển thị nút đăng nhập và đăng ký
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/auth/signin" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign In
                  <FaArrowRight />
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="lg:w-1/2">
            {randomImage && (
              <Image
                src={randomImage}
                alt="Developer Community"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
