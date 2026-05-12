"use client";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const facilities = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "2 Halls (Both A/C)",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: "Two Dining Halls",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7l2.45-3.674A2 2 0 017.121 2h9.758a2 2 0 011.671 1.326L21 7M3 7h18M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
      </svg>
    ),
    title: "Outdoor Dining",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-4-1a1 1 0 001 1h3M9 17h3" />
      </svg>
    ),
    title: "Car Parking",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "10 Rooms",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Cooking Space & Materials",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
    title: "Chairs & Dining Tables",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Decorations",
  },
];

export default function About() {
  return (
    <section 
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: 'color-mix(in srgb, var(--hotel-primary) 10%, white)' }}
    >
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-hotel-primary/30 via-hotel-primary/20 to-transparent pointer-events-none"></div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl -translate-y-1/2 pointer-events-none bg-hotel-primary/20"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl translate-y-1/2 pointer-events-none bg-hotel-primary/20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none bg-hotel-primary/15"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-hotel-primary/20 to-hotel-primary/10">
              <Crown className="w-8 h-8 text-hotel-primary" />
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
            Experience the RG Golden Palace Advantage
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-hotel-primary to-hotel-primary/50 rounded-full"></div>
          <p className="text-hotel-secondary-grey max-w-2xl mx-auto text-lg">
            From décor to dinner, we take care of it all.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-6 cursor-pointer transition-all duration-300 bg-hotel-secondary-accent/50 backdrop-blur-sm rounded-2xl hover:shadow-xl border border-hotel-secondary-light-grey/50"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-hotel-primary transition-all duration-300 bg-gradient-to-br from-hotel-primary/10 to-hotel-primary/5 group-hover:from-hotel-primary group-hover:to-hotel-primary/80 group-hover:text-white group-hover:shadow-lg group-hover:shadow-hotel-primary/30"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {facility.icon}
                  </div>
                </motion.div>
                <h3 className="text-base md:text-lg font-serif text-hotel-primary-text group-hover:text-hotel-primary transition-colors duration-300">
                  {facility.title}
                </h3>
                <div className="w-0 h-0.5 mt-3 bg-hotel-primary group-hover:w-12 transition-all duration-300 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
