"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const photos = [
  { id: 1, src: '/photos/poster1.jpg', alt: "Natyabandh Poster" },
  { id: 2, src: '/photos/poster2.jpg', alt: "Nirvan Poster" },
  { id: 3, src: '/photos/561890149_17859199461524711_895331180156967591_n..jpg', alt: "Firodiya Karandak 1" },
  { id: 4, src: '/photos/564252751_17859199449524711_8627099591409440068_n..jpg', alt: "Firodiya Karandak 2" },
  { id: 5, src: '/photos/617842358_17884211979434202_291496919472091398_n..jpg', alt: "Umaj 1" },
  { id: 6, src: '/photos/629764593_18433540573113561_6799555883835156326_n..jpg', alt: "Glimpses 1" },
  { id: 7, src: '/photos/631363976_961948082831139_8517859702143339031_n..jpg', alt: "Glimpses 2" },
  { id: 8, src: '/photos/633658783_961948042831143_8390242770874308140_n..jpg', alt: "Glimpses 3" },
  { id: 9, src: '/photos/634823790_961948062831141_1609978705656932725_n..jpg', alt: "Glimpses 4" }
];

export default function LegacySection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="min-h-screen font-sans py-6 px-4 sm:px-6 md:px-12 lg:px-24">
      
      {/* 1. Rangbhumi Motto */}
      <div className="text-center max-w-4xl mx-auto mb-6 space-y-4 pt-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-[family-name:var(--font-yatra-one)] pb-2 leading-tight">
          वारसा कलेचा, ध्यास रंगभूमीचा!
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 font-[family-name:var(--font-yatra-one)]">
          The Legacy of Art, The Passion for Theatre!
        </h2>
        <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto rounded-full mt-2"></div>
      </div>

      {/* 2. Image Gallery Slider */}
      <div 
        className="max-w-5xl mx-auto mb-12 relative group rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-gray-100 bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-1000 ease-in-out items-center"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {photos.map((photo) => (
            <div key={photo.id} className="min-w-full h-80 sm:h-96 md:h-[500px] relative bg-stone-100 p-2 md:p-4 flex items-center justify-center">
              <Image 
                src={photo.src} 
                alt={photo.alt} 
                fill
                className="object-contain drop-shadow-md rounded-lg pointer-events-none"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Slider Controls - High Visibility on Mobile */}
        <button 
          onClick={() => setCurrentSlide(prev => prev === 0 ? photos.length - 1 : prev - 1)}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/95 text-red-600 p-3 md:p-4 rounded-full shadow-2xl z-20 border border-gray-200 block md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => prev === photos.length - 1 ? 0 : prev + 1)}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/95 text-red-600 p-3 md:p-4 rounded-full shadow-2xl z-20 border border-gray-200 block md:opacity-0 md:group-hover:opacity-100 transition-all duration-300"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-full z-10">
          {photos.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3. Book Ticket Button Container */}
      <div className="max-w-md mx-auto text-center mb-20 p-6 md:p-8">
        <h3 className="mb-6 text-2xl md:text-3xl font-bold text-gray-800 font-[family-name:var(--font-yatra-one)]">
          तिकीट बुक करा <br/><span className="text-lg md:text-xl text-gray-500">(Book Your Tickets)</span>
        </h3>
        <div className="flex justify-center w-full min-h-[60px]">
          {/* Exact original Razorpay embed */}
          <div className="razorpay-embed-btn" data-url="https://pages.razorpay.com/pl_Sm4lewjojhLZpg/view" data-text="Book Now" data-color="#752DE1" data-size="large">
             {/* Fallback link if script fails */}
             <a href="https://pages.razorpay.com/pl_Sm4lewjojhLZpg/view" className="bg-[#752DE1] text-white px-8 py-3 rounded-lg font-bold uppercase md:hidden shadow-lg">Book Now</a>
          </div>
        </div>
      </div>

      {/* 4. Achievement Section */}
      <div className="max-w-6xl mx-auto mb-20 px-2 sm:px-0">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="h-[2px] w-8 md:w-16 bg-red-500"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-[family-name:var(--font-yatra-one)] text-center">सुवर्ण क्षण <br className="sm:hidden" /><span className="text-xl md:text-2xl text-gray-500">(Achievements)</span></h3>
          <div className="h-[2px] w-8 md:w-16 bg-red-500"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <h4 className="text-xl md:text-2xl font-bold text-red-600 mb-4 font-[family-name:var(--font-yatra-one)]">पुरुषोत्तम करंडक <br/><span className="text-sm md:text-base text-gray-500">(Purushottam Karandak)</span></h4>
            <ul className="space-y-3 text-gray-700 text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-0.5">🏆</span>
                <span>'निर्वाण' - कै. गिरीश आठले स्मृतिचिन्ह दिग्दर्शनासाठी</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-0.5">🏆</span>
                <span>उत्कृष्ट अभिनय व नेपथ्य</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <h4 className="text-xl md:text-2xl font-bold text-orange-600 mb-4 font-[family-name:var(--font-yatra-one)]">फिरोदिया करंडक <br/><span className="text-sm md:text-base text-gray-500">(Firodiya Karandak)</span></h4>
            <ul className="space-y-3 text-gray-700 text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-0.5">🥈</span>
                <span>'उमज' - द्वितीय पारितोषिक (Second Prize)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-0.5">🎭</span>
                <span>'रंगांपलीकडे' (Rangon Se Pare) - Puppet & Sculpture Prizes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Previous Year Glimpses */}
      <div className="max-w-7xl mx-auto mb-20 px-2 sm:px-0">
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="h-[2px] w-8 md:w-16 bg-red-500"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-[family-name:var(--font-yatra-one)] text-center">मागील आठवणी <br className="sm:hidden" /><span className="text-xl md:text-2xl text-gray-500">(Previous Glimpses)</span></h3>
          <div className="h-[2px] w-8 md:w-16 bg-red-500"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {photos.slice(2).map((photo) => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-stone-200 bg-white p-2">
              <div className="relative w-full aspect-square sm:aspect-[4/5] rounded-lg overflow-hidden">
                <Image 
                  src={photo.src} 
                  alt={photo.alt}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
