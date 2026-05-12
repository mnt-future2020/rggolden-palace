"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import BookingModal from "./BookingModal";

// Skeleton Loader Component
const HeroSkeleton = () => {
  return (
    <div className="relative max-sm:h-[60vh] sm:h-[60vh] md:h-[90vh] lg:h-[90vh]">
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-gray-300 animate-pulse" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Content Skeleton */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
          {/* Title Skeleton */}
          <div className="space-y-2 sm:space-y-3">
            <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 2xl:h-16 bg-white/20 rounded animate-pulse mx-auto max-w-[95%] sm:max-w-[90%]" />
            <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 2xl:h-16 bg-white/20 rounded animate-pulse mx-auto max-w-[80%] sm:max-w-[75%]" />
          </div>
          
          {/* Quote Skeleton */}
          <div className="space-y-2">
            <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-white/15 rounded animate-pulse mx-auto max-w-[90%] sm:max-w-[80%]" />
            <div className="h-3 sm:h-4 md:h-5 lg:h-6 bg-white/15 rounded animate-pulse mx-auto max-w-[70%] sm:max-w-[60%]" />
          </div>
          
          {/* Button Skeleton */}
          <div className="flex justify-center">
            <div className="w-full xs:w-auto min-w-[140px] max-w-[280px] h-10 sm:h-12 md:h-14 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const [heroData, setHeroData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/web-settings");
        if (
          response.data &&
          response.data.heroSections &&
          response.data.heroSections[0]
        ) {
          setHeroData(response.data.heroSections[0]);
        }
      } catch (error) {
        console.error("Error fetching hero section data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const highlightHotelName = (text) => {
    const patterns = [
      "RG Golden Palace",
      "Renganathan Gandhimathi Palace",
      "RG GOLDEN PALACE",
      "RENGANATHAN GANDHIMATHI PALACE",
      "JRV Mahal", // Keep old ones just in case data hasn't updated
    ];

    let result = text;
    patterns.forEach((pattern) => {
      const regex = new RegExp(pattern, "gi");
      result = result.replace(
        regex,
        `<span class="text-hotel-primary font-semibold">${pattern}</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  // Show skeleton loader while loading
  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Return null if no data after loading
  if (!heroData) return null;

  return (
    <div className="relative max-sm:h-[60vh] sm:h-[60vh] md:h-[90vh] lg:h-[90vh]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroData.image})`,
        }}
      />

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Centered Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <motion.div
          className=" w-full"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl
              font-serif mb-3 sm:mb-4 md:mb-6 
              text-white 
              leading-snug sm:leading-snug md:leading-tight lg:leading-tight
              px-2 sm:px-4
              font-medium
              tracking-normal sm:tracking-wide
              transition-all duration-300
              max-w-[95%] sm:max-w-[90%] mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {highlightHotelName(heroData.title)}
          </motion.h1>

          <motion.p
            className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl
              text-white 
              mb-4 sm:mb-6 md:mb-8
              tracking-wider
              font-light sm:font-normal
              px-4 sm:px-6 md:px-8
              leading-relaxed sm:leading-relaxed md:leading-relaxed
              max-w-[90%] sm:max-w-[80%] mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {heroData.quote}
          </motion.p>
          <motion.div
            className="flex justify-center w-full px-2 sm:px-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center justify-center
                px-6 sm:px-8 py-2.5 sm:py-3 md:py-4
                text-sm sm:text-base md:text-lg font-medium
                text-white bg-hotel-primary
                overflow-hidden transition-all duration-300
                hover:bg-hotel-primary/90 hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-hotel-primary focus:ring-offset-2"
            >
              <span className="relative">
                Book your dream venue today!
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 
                  transition-transform duration-300 group-hover:scale-x-100"
                />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
