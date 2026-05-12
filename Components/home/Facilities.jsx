"use client";
import Image from "next/image"
import { motion } from "framer-motion"

export default function Home() {
  const venueFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      text: "Modern infrastructure"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      text: "Elegant stage & decor"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      text: "Individual rooms available for Groom, Bride, Family & Guests"
    }
  ];

  const roomFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      text: "Air Conditioning"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "24/7 Water Supply"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      text: "Neatly Furnished Beds"
    }
  ];

  return (
    <main className="flex flex-col bg-gradient-to-r from-hotel-primary to-hotel-primary/90 mx-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-hotel-primary/10 blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-hotel-primary/10 blur-3xl translate-y-1/2"></div>

      {/* Venue Overview Section - Redesigned */}
      <section className="flex flex-col md:flex-row gap-0 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative group overflow-hidden"
        >
          <Image
            src="/hall/mahal-dinning.jpeg"
            alt="Luxury banquet hall with elegant dining setup and purple lighting"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <div className="bg-gradient-to-r from-hotel-primary to-hotel-primary/90 text-white px-4 py-3 rounded-lg backdrop-blur-sm shadow-xl">
              <p className="text-lg font-semibold">Capacity: Up to 1000 Guests</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 xl:p-20 flex flex-col justify-center bg-hotel-secondary-accent/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-hotel-primary font-semibold text-sm uppercase tracking-wider inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-hotel-primary"></span>
              PREMIUM VENUE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-hotel-primary-text mb-6">
              Venue Overview
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-hotel-primary to-hotel-primary/50 mb-6 rounded-full"></div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base lg:text-lg text-hotel-secondary-grey mb-8 leading-relaxed"
          >
            Our centrally air-conditioned event hall is a masterpiece of space and style. With a capacity to accommodate
            up to 1000 guests, it features luxurious décor, customizable stage arrangements, modern lighting, and
            premium audio-visual support. Whether it&apos;s a traditional wedding or a modern gathering, the ambiance fits
            all themes.
          </motion.p>

          <div className="space-y-4">
            {venueFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-hotel-primary/10 flex items-center justify-center text-hotel-primary group-hover:bg-gradient-to-br group-hover:from-hotel-primary group-hover:to-hotel-primary/80 group-hover:text-white group-hover:shadow-lg group-hover:shadow-hotel-primary/30 transition-all duration-300 flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="text-base lg:text-lg text-hotel-secondary-grey leading-relaxed pt-2.5 group-hover:text-hotel-primary-text transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Room Overview Section - Redesigned */}
      <section className="flex flex-col md:flex-row-reverse gap-0 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative group overflow-hidden"
        >
          <Image
            src="/hall/mahal-outside.jpeg"
            alt="Luxury banquet hall exterior with elegant lighting at night"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <div className="bg-gradient-to-r from-hotel-primary to-hotel-primary/90 text-white px-4 py-3 rounded-lg backdrop-blur-sm shadow-xl">
              <p className="text-lg font-semibold">Comfortable & Affordable Stay</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 xl:p-20 flex flex-col justify-center bg-hotel-secondary-accent/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-hotel-primary font-semibold text-sm uppercase tracking-wider inline-flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-hotel-primary"></span>
              COMFORTABLE STAY
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-hotel-primary-text mb-6">
              Room Overview
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-hotel-primary to-hotel-primary/50 mb-6 rounded-full"></div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base lg:text-lg text-hotel-secondary-grey mb-8 leading-relaxed"
          >
            Our well-maintained rooms are available for individual travelers and tourists looking for a cozy and
            affordable stay. Whether you&apos;re here for an event or exploring the city, our rooms are designed to give you
            the comfort you need.
          </motion.p>

          <div className="space-y-4">
            {roomFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-hotel-primary/10 flex items-center justify-center text-hotel-primary group-hover:bg-gradient-to-br group-hover:from-hotel-primary group-hover:to-hotel-primary/80 group-hover:text-white group-hover:shadow-lg group-hover:shadow-hotel-primary/30 transition-all duration-300 flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="text-base lg:text-lg text-hotel-secondary-grey leading-relaxed pt-2.5 group-hover:text-hotel-primary-text transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  )
}
