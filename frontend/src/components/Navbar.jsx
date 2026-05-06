"use client";
import Image from 'next/image';
import Script from 'next/script';

export default function Navbar() {
  return (
    <>
      <Script 
        id="razorpay-embed-btn-js"
        src="https://cdn.razorpay.com/static/embed_btn/bundle.js"
        onLoad={() => {
          if (window.__rzp__) {
            window.__rzp__.init();
          }
        }}
      />
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo and Name on the Left */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <div className="relative h-10 w-12 md:h-14 md:w-16 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="Natyabandh Logo" 
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-[family-name:var(--font-yatra-one)] mt-1">
              नाट्यबंध
            </span>
          </div>

          {/* Razorpay Button on the Right */}
          <div className="flex items-center min-w-[100px] justify-end">
            <div 
              className="razorpay-embed-btn" 
              data-url="https://pages.razorpay.com/pl_Sm4lewjojhLZpg/view" 
              data-text="Book Now" 
              data-color="#752DE1" 
              data-size="small"
            >
              {/* Fallback link if script fails */}
              <a href="https://pages.razorpay.com/pl_Sm4lewjojhLZpg/view" className="text-xs bg-[#752DE1] text-white px-3 py-1.5 rounded font-bold uppercase md:hidden">Book</a>
            </div>
          </div>

        </div>
      </div>
      </nav>
    </>
  );
}
