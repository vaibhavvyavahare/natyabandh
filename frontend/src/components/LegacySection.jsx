"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const galleryItems = [
  { id: 1, src: '/photos/vedo.mp4', alt: "Natyabandh Promo Video", type: 'video' },
  { id: 2, src: '/photos/mainposter.png', alt: "Natyabandh Main Poster", type: 'image' },
  { id: 3, src: '/photos/rango_se_pare1.jpg', alt: "Rango Se Pare Poster", type: 'image' },
  { id: 4, src: '/photos/umaj.jpg', alt: "Umaj Poster", type: 'image' },
  { id: 5, src: '/photos/rango1.jpg', alt: "Rango Se Pare Action", type: 'image' },
  { id: 6, src: '/photos/Umaj1.jpg', alt: "Umaj Action", type: 'image' },
];

export default function LegacySection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const videoRef = useRef(null);

  const SLIDE_DURATION = 3500;

  const scrollToSlide = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % galleryItems.length;
    scrollToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + galleryItems.length) % galleryItems.length;
    scrollToSlide(prevIndex);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const slideWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    
    if (newIndex !== currentSlide) {
      setCurrentSlide(newIndex);
      setProgress(0);
    }
  };

  // Progress Bar Animation
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    const currentItem = galleryItems[currentSlide];
    
    // If it's a video, the video element handles progress via onTimeUpdate
    if (currentItem.type === 'video') {
      return () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      };
    }

    const step = 100 / (SLIDE_DURATION / 50);
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentSlide]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleVideoEnded = () => {
    nextSlide();
  };

  return (
    <section className="min-h-screen bg-black text-white font-sans pt-20 pb-12 px-4 sm:px-6 md:px-12 lg:px-24">
      
      {/* 9:16 Portrait Slider */}
      <div className="max-w-xs mx-auto mb-6 relative group rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.4)] border-4 border-stone-800 bg-stone-950 aspect-[9/16]">
        
        {/* Mute/Unmute Toggle */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-16 right-4 z-[60] bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 hover:bg-white/20 transition-all text-white"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          )}
        </button>

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center z-[50] pointer-events-none">
           <button 
            type="button"
            onClick={(e) => { e.preventDefault(); prevSlide(); }}
            className="bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 active:bg-red-600 transition-all pointer-events-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>
        
        <div className="absolute inset-y-0 right-0 w-10 flex items-center justify-center z-[50] pointer-events-none">
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); nextSlide(); }}
            className="bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/10 active:bg-red-600 transition-all pointer-events-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {/* NATIVE SCROLL CONTAINER */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar touch-auto"
          style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {galleryItems.map((item, idx) => (
            <div 
              key={idx} 
              className="min-w-full h-full flex-shrink-0 snap-center relative flex items-center justify-center p-[11px] bg-stone-950"
            >
              <div className="relative w-full h-full pointer-events-none overflow-hidden rounded-2xl">
                {item.type === 'video' ? (
                  <video 
                    ref={currentSlide === idx ? videoRef : null}
                    src={item.src}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={currentSlide === idx ? handleVideoTimeUpdate : null}
                    onEnded={currentSlide === idx ? handleVideoEnded : null}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image 
                    src={item.src} 
                    alt={item.alt} 
                    fill
                    className="object-contain drop-shadow-2xl"
                    unoptimized
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars (The "Status Lines") */}
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20 pointer-events-none">
          {galleryItems.map((_, idx) => (
            <div key={idx} className="h-1 flex-grow bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-75`}
                style={{ 
                  width: currentSlide === idx ? `${progress}%` : currentSlide > idx ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Rangbhumi Motto */}
      <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-[family-name:var(--font-yatra-one)] pb-2 leading-tight">
          वारसा कलेचा, ध्यास रंगभूमीचा!
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-stone-300 font-[family-name:var(--font-yatra-one)]">
          The Legacy of Art, The Passion for Theatre!
        </h2>
        <div className="w-16 md:w-24 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
      </div>

      {/* Achievement Section */}
      <div className="max-w-6xl mx-auto mb-20 px-2 sm:px-0">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-red-600"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-yatra-one)] text-center">सुवर्ण क्षण <br className="sm:hidden" /><span className="text-xl md:text-2xl text-stone-500 ml-2">(Achievements)</span></h3>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-red-600"></div>
        </div>
        
        {/* --- High-Sensitivity Horizontal Strip --- */}
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar touch-auto gap-6 px-4 sm:px-0 pb-12 overflow-y-hidden">
            
            {/* 2025 Marker */}
            <div className="flex-shrink-0 flex items-center justify-center w-24 snap-start">
              <span className="text-6xl font-black text-red-600/10 font-mono -rotate-90">2025</span>
            </div>

            {/* 1. Prakash Inamdar 2025 */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-red-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-red-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 प्रकाश इनामदार करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"उमज"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🎭</span> <span>एकांकिका – तृतीय क्रमांक</span></li>
                  <li className="flex items-start gap-2"><span>✍️</span> <span>विशेष उल्लेखनीय लेखिका</span></li>
                  <li className="flex items-start gap-2"><span>🎬</span> <span>विशेष उल्लेखनीय दिग्दर्शिका</span></li>
                  <li className="flex items-start gap-2"><span>👤</span> <span>पुरुष अभिनय – तृतीय</span></li>
                </ul>
              </div>
            </div>
            
            {/* 2. Dadu Indurikar 2025 */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-orange-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 दादू इंदुरीकर करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"उमज"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🎭</span> <span>एकांकिका – तृतीय क्रमांक</span></li>
                  <li className="flex items-start gap-2"><span>🎶</span> <span>पार्श्वसंगीत – द्वितीय</span></li>
                  <li className="flex items-start gap-2"><span>👤</span> <span>पुरुष अभिनय – उत्तेजनार्थ</span></li>
                </ul>
              </div>
            </div>

            {/* 3. Balasaheb Thackeray 2025 */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-yellow-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-600/10 rounded-full blur-3xl group-hover:bg-yellow-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-yellow-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 बाळासाहेब ठाकरे करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"उमज"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🎭</span> <span>एकांकिका – द्वितीय क्रमांक</span></li>
                  <li className="flex items-start gap-2"><span>🎶</span> <span>सर्वोत्कृष्ट पार्श्वसंगीत</span></li>
                  <li className="flex items-start gap-2"><span>💄</span> <span>सर्वोत्कृष्ट रंगभूषा</span></li>
                </ul>
              </div>
            </div>

            {/* 4. Firodiya (Rango Se Pare) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-indigo-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🎨 फिरोदिया करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"Rango Se Pare"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🎭</span> <span>Puppet & Sculpture Prizes</span></li>
                </ul>
              </div>
            </div>

            {/* 2024 Marker */}
            <div className="flex-shrink-0 flex items-center justify-center w-24 snap-start">
              <span className="text-6xl font-black text-blue-600/10 font-mono -rotate-90">2024</span>
            </div>

            {/* 5. Purushottam 2024 (Nirvan) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-blue-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 पुरुषोत्तम करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"निर्वाण"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🏆</span> <span>दिग्दर्शन (महिला)</span></li>
                  <li className="flex items-start gap-2"><span>🏆</span> <span>अभिनय (पुरुष)</span></li>
                  <li className="flex items-start gap-2"><span>✨</span> <span>गिरीश आठले स्मृतिचिन्ह</span></li>
                </ul>
              </div>
            </div>

            {/* 6. Ajitparva (Nirvan) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-600/10 rounded-full blur-3xl group-hover:bg-emerald-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-emerald-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 अजितपर्व स्पर्धा
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"निर्वाण"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🏆</span> <span>सर्वोत्कृष्ट लेखक</span></li>
                  <li className="flex items-start gap-2"><span>🏆</span> <span>प्रकाश योजना</span></li>
                </ul>
              </div>
            </div>

            {/* 7. Nilu Phule (Nirvan) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-purple-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 निळू फुले करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"निर्वाण"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🏅</span> <span>उत्तेजनार्थ अभिनय (पुरुष)</span></li>
                </ul>
              </div>
            </div>

            {/* 8. Thackeray Discipline (Nirvan) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-cyan-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🏆 ठाकरे करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"निर्वाण"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🏅</span> <span>उत्कृष्ट शिस्तबद्ध संघ</span></li>
                </ul>
              </div>
            </div>

            {/* 9. Firodiya (Andhagharam) */}
            <div className="min-w-[280px] md:min-w-[350px] snap-center">
              <div className="bg-stone-900/40 rounded-2xl p-6 border border-white/5 hover:border-pink-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-600/10 rounded-full blur-3xl group-hover:bg-pink-600/20 transition-all"></div>
                <h4 className="text-xl font-bold text-pink-500 mb-2 font-[family-name:var(--font-yatra-one)] leading-relaxed">
                  🎨 फिरोदिया करंडक
                </h4>
                <div className="text-stone-500 text-sm mb-4 italic">"Andhagharam"</div>
                <ul className="space-y-3 text-stone-300 text-sm flex-grow">
                  <li className="flex items-start gap-2"><span>🥇</span> <span>किरीगामी / ट्विग आर्ट</span></li>
                  <li className="flex items-start gap-2"><span>🥇</span> <span>शॅडो पोर्ट्रेट</span></li>
                  <li className="flex items-start gap-2"><span>🥈</span> <span>लोकसंगीत गायन</span></li>
                </ul>
              </div>
            </div>

          </div>
          
          {/* Scroll Hint */}
          <div className="flex justify-center items-center gap-3 text-stone-600 text-xs uppercase tracking-widest mt-[-20px]">
            <div className="w-12 h-[1px] bg-stone-800"></div>
            <span>Scroll horizontally to see all awards</span>
            <div className="w-12 h-[1px] bg-stone-800"></div>
          </div>
        </div>
      </div>

      {/* 5. Award Photo Gallery */}
      <div className="max-w-6xl mx-auto mb-20 px-4 sm:px-0 mt-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-orange-500"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-yatra-one)] text-center">Award Gallery</h3>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-orange-500"></div>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          {/* Slider Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar rounded-2xl border border-white/10 bg-stone-950 aspect-video md:aspect-[21/9]">
            
            {/* Slide 1 */}
            <div className="min-w-full h-full snap-center relative">
              <Image 
                src="/photos/2025 awaeds.jpg" 
                alt="2025 Awards" 
                fill 
                className="object-contain p-2"
                unoptimized
              />
              <div className="absolute bottom-4 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-white font-bold text-sm">2025 Awards</span>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="min-w-full h-full snap-center relative">
              <Image 
                src="/photos/2024 awards.jpg" 
                alt="2024 Awards" 
                fill 
                className="object-contain p-2"
                unoptimized
              />
              <div className="absolute bottom-4 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-white font-bold text-sm">2024 Awards</span>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="min-w-full h-full snap-center relative">
              <Image 
                src="/photos/award.jpg" 
                alt="Awards Trophy" 
                fill 
                className="object-contain p-2"
                unoptimized
              />
            </div>

            {/* Slide 4 */}
            <div className="min-w-full h-full snap-center relative">
              <Image 
                src="/photos/poster2.jpg" 
                alt="Natyabandh Poster" 
                fill 
                className="object-contain p-2"
                unoptimized
              />
            </div>

          </div>

          {/* Swipe Indicator */}
          <div className="flex justify-center gap-2 mt-4">
             <div className="w-12 h-1 bg-red-600 rounded-full animate-pulse"></div>
             <div className="w-1.5 h-1.5 bg-stone-700 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-stone-700 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-stone-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 6. Previous Glimpses */}
      <div className="max-w-6xl mx-auto mb-20 px-4 sm:px-0 mt-24">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-orange-600"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-yatra-one)] text-center">Previous Glimpses</h3>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-orange-600"></div>
        </div>

        <div className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group shadow-orange-900/10">
          <Image 
            src="/photos/pastG1.jpg" 
            alt="Historical Glimpse" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        
        {/* New Corner Label Below Card */}
        <div className="flex justify-end mt-4">
          <h4 className="text-xl md:text-2xl font-bold text-orange-500 font-[family-name:var(--font-yatra-one)] italic tracking-wide">
            — नाट्यबंध: एक प्रवास
          </h4>
        </div>
      </div>

      {/* 7. Social Media Card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-0 mb-12">
        <a 
          href="https://www.instagram.com/rscoe_rangabhumi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden transition-all duration-500 hover:border-pink-500/30 hover:shadow-[0_0_60px_rgba(219,39,119,0.1)] group-hover:-translate-y-1">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/10 rounded-full blur-[80px] group-hover:bg-pink-600/20 transition-all"></div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 rounded-xl flex items-center justify-center p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                  <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#insta-grad-sm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="insta-grad-sm" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#facc15" />
                          <stop offset="0.5" stopColor="#db2777" />
                          <stop offset="1" stopColor="#9333ea" />
                        </linearGradient>
                      </defs>
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-0.5">For more glimpses...</h3>
                  <p className="text-stone-400 text-sm">Follow us on Instagram</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all">
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-600 to-purple-600 font-mono">
                  @rscoe_rangabhumi
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>

    </section>
  );
}
