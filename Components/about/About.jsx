"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import BookingModal from "../home/BookingModal";
import Link from "next/link";

export default function About() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="h-[300px] relative flex items-center justify-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/banner/1.jpg")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-serif mb-4">ABOUT US</h1>
        </div>
      </div>

      {/* Parents Welcome Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 8%, white), white)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Title at Top Center */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-hotel-primary px-4">
              ஸ்ரீ செகுட்டையனார் துணை
            </h2>
            <div className="w-24 sm:w-32 md:w-40 h-1 bg-hotel-primary mx-auto mt-3 sm:mt-4"></div>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Left Image */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 relative h-[250px] sm:h-[300px] md:h-[340px] lg:h-[380px] flex items-center"
            >
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="/banner/Parents.png"
                  alt="Founders - Renganathan Gandhimathi"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 flex items-stretch"
            >
              <div
                className="bg-white h-auto lg:h-full p-5 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-r-4 border-hotel-primary w-full flex flex-col justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--hotel-primary) 3%, white)",
                }}
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium font-serif text-hotel-primary-text mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  Welcome
                </h3>
                <p className="text-sm sm:text-base md:text-md lg:text-md text-hotel-secondary-grey leading-relaxed sm:leading-relaxed md:leading-loose">
                  With the divine blessings of Sri Sekuttayanar, we warmly
                  welcome you to Renganathan Gandhimathi Palace. Our family is
                  honored to host your celebrations in this sacred space, where
                  tradition meets elegance. May your special moments here be
                  filled with joy, prosperity, and cherished memories.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Introduction Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full py-16 px-4 md:px-8 lg:px-16 xl:px-0 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 text-center lg:text-left px-4 sm:px-6 lg:px-0"
            >
              <h3
                className="text-xs sm:text-sm md:text-base text-gray-700 uppercase tracking-wider font-medium mb-2 sm:mb-3 
                relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-hotel-primary 
                after:bottom-0 after:left-1/2 after:-translate-x-1/2 lg:after:left-0 lg:after:translate-x-0"
              >
                RG GOLDEN PALACE
              </h3>

              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                font-medium text-gray-800 leading-[1.2] sm:leading-[1.3] md:leading-[1.4] 
                tracking-tight mb-4 sm:mb-6 md:mb-8 font-serif"
              >
                <span className="block">The Grandest Celebration</span>
                <span
                  className="block mt-1 sm:mt-2 bg-gradient-to-r from-hotel-primary to-hotel-primary
                  text-transparent bg-clip-text"
                >
                  Venue in the Region
                </span>
              </h1>

              <p
                className="text-sm sm:text-base md:text-lg text-gray-600 
                max-w-[280px] sm:max-w-lg mx-auto lg:mx-0 
                leading-relaxed sm:leading-relaxed md:leading-loose 
                mb-6 sm:mb-8 md:mb-10"
              >
                Renganathan Gandhimathi Palace is the region’s largest, most
                spacious, and most prestigious event destination, thoughtfully
                designed to host weddings and celebrations with unmatched
                elegance. With expansive infrastructure, exceptional amenities,
                and seamless planning, we ensure that every event becomes a
                cherished memory.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center justify-center
                  px-6 sm:px-8 py-2.5 sm:py-3 md:py-4
                  text-sm sm:text-base md:text-lg font-medium
                  text-white bg-hotel-primary
                  overflow-hidden  transition-all duration-300
                  hover:bg-hotel-primary/90 hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-hotel-primary focus:ring-offset-2"
              >
                <span className="relative">
                  BOOK NOW
                  <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 
                    transition-transform duration-300 group-hover:scale-x-100"
                  />
                </span>
              </button>
            </motion.div>

            {/* Image */}
            <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-10 lg:mt-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full  relative"
              >
                <div className="relative w-full h-full transform transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/contact/3.png"
                    alt="RG Golden Palace Venue"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Event Spaces Section - Redesigned */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 5%, white), white)",
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-hotel-primary/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-hotel-primary/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-hotel-primary font-medium text-sm uppercase tracking-wider mb-2 inline-block">
              DISCOVER OUR VENUES
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
              Our Event Spaces
            </h2>
            <div className="w-24 h-1 bg-hotel-primary mx-auto mb-6"></div>
            <p className="text-hotel-secondary-grey max-w-2xl mx-auto text-lg">
              Discover the perfect setting for your special occasion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-hotel-primary/10 flex items-center justify-center mb-6 group-hover:bg-hotel-primary/20 transition-colors">
                <svg
                  className="w-8 h-8 text-hotel-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-hotel-primary group-hover:text-hotel-primary/90 transition-colors">
                The Grand Hall
              </h3>
              <p className="text-hotel-secondary-grey leading-relaxed">
                Built for lavish weddings, grand receptions, corporate
                gatherings, and large-scale celebrations, the Grand Hall offers
                an impressive layout, elegant interiors, and limitless décor
                possibilities—making it the perfect choice for milestone
                occasions.
              </p>
              <div className="mt-6 flex items-center text-hotel-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-hotel-primary/10 flex items-center justify-center mb-6 group-hover:bg-hotel-primary/20 transition-colors">
                <svg
                  className="w-8 h-8 text-hotel-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif mb-4 text-hotel-primary group-hover:text-hotel-primary/90 transition-colors">
                The Classic Hall
              </h3>
              <p className="text-hotel-secondary-grey leading-relaxed">
                Crafted for smaller gatherings such as birthday parties, family
                functions, engagement events, and pre-wedding rituals, the
                Classic Hall provides a warm, intimate, and comfortable setting.
              </p>
              <div className="mt-6 flex items-center text-hotel-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden border border-hotel-primary/20"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--hotel-primary) 8%, white), color-mix(in srgb, var(--hotel-primary) 3%, white))",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-hotel-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-hotel-primary/10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h4 className="text-2xl md:text-3xl font-serif mb-8 text-center text-hotel-primary-text">
                Each hall includes:
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-hotel-secondary-accent/60 backdrop-blur-sm hover:bg-hotel-secondary-accent transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-hotel-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-hotel-primary transition-colors">
                    <svg
                      className="w-5 h-5 text-hotel-primary group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-hotel-primary-text leading-relaxed font-medium">
                    Independent dining space
                  </span>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-hotel-secondary-accent/60 backdrop-blur-sm hover:bg-hotel-secondary-accent transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-hotel-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-hotel-primary transition-colors">
                    <svg
                      className="w-5 h-5 text-hotel-primary group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-hotel-primary-text leading-relaxed font-medium">
                    Fully equipped and separate kitchen
                  </span>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-hotel-secondary-accent/60 backdrop-blur-sm hover:bg-hotel-secondary-accent transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-hotel-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-hotel-primary transition-colors">
                    <svg
                      className="w-5 h-5 text-hotel-primary group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-hotel-primary-text leading-relaxed font-medium">
                    Smooth, private flow from ceremony to dining
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dining Experience Section - Redesigned */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-hotel-primary/5 blur-3xl -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-hotel-primary font-medium text-sm uppercase tracking-wider mb-2 inline-block">
              CULINARY EXCELLENCE
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
              Dining Experience
            </h2>
            <div className="w-24 h-1 bg-hotel-primary mx-auto mb-6"></div>
            <p className="text-hotel-secondary-grey max-w-2xl mx-auto text-lg">
              Dining at Renganathan Gandhimathi Palace is designed to be both
              delightful and convenient.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                ),
                title: "Indoor Dining Hall",
                description:
                  "A large, comfortable setting designed to serve guests efficiently during peak event hours.",
                delay: 0.2,
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                ),
                title: "Modern Kitchens",
                description:
                  "Our kitchens are equipped to prepare food for up to 1,000 guests, ensuring timely, high-quality service.",
                delay: 0.3,
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                ),
                title: "In-House Catering",
                description:
                  "Our experienced culinary team offers diverse menu options—from traditional delicacies to contemporary cuisine—tailored to your preferences.",
                delay: 0.4,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-hotel-primary/10 flex items-center justify-center mb-6 text-hotel-primary group-hover:bg-hotel-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-hotel-primary-text group-hover:text-hotel-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-hotel-secondary-grey leading-relaxed">
                  {item.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-hotel-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-hotel-primary/10 mb-4">
              <svg
                className="w-6 h-6 text-hotel-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-hotel-secondary-grey text-lg max-w-3xl mx-auto">
              For events that prefer an outdoor ambience, we offer an{" "}
              <span className="font-semibold text-hotel-primary">
                Open Dining Area
              </span>{" "}
              that can be used when weather conditions permit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Accommodation & Amenities Section - Redesigned */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--hotel-primary) 5%, white), white)",
        }}
      >
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-hotel-primary/5 blur-3xl translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-hotel-primary font-medium text-sm uppercase tracking-wider mb-2 inline-block">
              COMFORT & ELEGANCE
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
              Accommodation & Amenities
            </h2>
            <div className="w-24 h-1 bg-hotel-primary mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Accommodation Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-hotel-primary/10 flex items-center justify-center mr-4">
                  <svg
                    className="w-7 h-7 text-hotel-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-hotel-primary-text">
                  Accommodation
                </h2>
              </div>

              <p className="text-hotel-secondary-grey mb-6 leading-relaxed">
                To enhance comfort for families and outstation guests, we
                provide:
              </p>

              <div
                className="relative p-6 rounded-xl mb-6 overflow-hidden border-2 border-hotel-primary/30"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--hotel-primary) 15%, white), color-mix(in srgb, var(--hotel-primary) 8%, white))",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-hotel-primary/20 blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-hotel-primary/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-hotel-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-hotel-primary">
                      10 Spacious Bedrooms
                    </h3>
                  </div>
                  <p className="text-hotel-secondary-grey font-medium">
                    Beautifully furnished rooms with all modern amenities
                  </p>
                </div>
              </div>

              <p className="text-hotel-secondary-grey mb-4 font-medium">
                Available at additional cost, ideal for:
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Bride & groom",
                  "Immediate family members",
                  "Outstation guests",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-hotel-primary/10 flex items-center justify-center group-hover:bg-hotel-primary transition-colors">
                      <svg
                        className="w-4 h-4 text-hotel-primary group-hover:text-white transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-hotel-secondary-grey">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl border-l-4 border-hotel-primary"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--hotel-primary) 5%, white)",
                }}
              >
                <p className="text-hotel-secondary-grey leading-relaxed">
                  These rooms ensure convenience, rest, and privacy throughout
                  the event.
                </p>
              </div>
            </motion.div>

            {/* Décor & Vendor Support Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-hotel-primary/10 flex items-center justify-center mr-4">
                  <svg
                    className="w-7 h-7 text-hotel-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif text-hotel-primary-text">
                  Décor & Vendor Support
                </h2>
              </div>

              <p className="text-hotel-secondary-grey mb-6 leading-relaxed">
                We partner with professional vendors specializing in:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: "🎭", text: "Stage decoration" },
                  { icon: "✨", text: "Hall décor" },
                  { icon: "🌸", text: "Floral arrangements" },
                  { icon: "💡", text: "Lighting setups" },
                  { icon: "🎨", text: "Theme-based displays" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-hotel-primary/5 transition-colors group"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--hotel-primary) 5%, white)",
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-hotel-secondary-grey group-hover:text-hotel-primary transition-colors">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div
                className="p-6 rounded-xl border border-hotel-primary/20"
                style={{
                  background:
                    "linear-gradient(to bottom right, color-mix(in srgb, var(--hotel-primary) 10%, white), color-mix(in srgb, var(--hotel-primary) 5%, white))",
                }}
              >
                <p className="text-hotel-secondary-grey leading-relaxed">
                  Whether your style is{" "}
                  <span className="font-semibold text-hotel-primary">
                    traditional
                  </span>
                  ,{" "}
                  <span className="font-semibold text-hotel-primary">
                    modern
                  </span>
                  , or{" "}
                  <span className="font-semibold text-hotel-primary">
                    extravagant
                  </span>
                  , our décor experts help bring your event vision to life.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parking Section - Redesigned */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-hotel-primary/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-hotel-primary font-medium text-sm uppercase tracking-wider mb-2 inline-block">
              HASSLE-FREE PARKING
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
              Parking
            </h2>
            <div className="w-24 h-1 bg-hotel-primary mx-auto mb-6"></div>
            <p className="text-hotel-secondary-grey max-w-3xl mx-auto text-lg leading-relaxed">
              Renganathan Gandhimathi Palace is known for its huge,
              well-organised parking area—one of the largest in the region.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                ),
                title: "Easy Access",
                description: "Easy arrival and exit",
                delay: 0.2,
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Zero Congestion",
                description: "Smooth traffic flow",
                delay: 0.3,
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                ),
                title: "High Capacity",
                description:
                  "Comfortable parking for a high volume of vehicles",
                delay: 0.4,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-hotel-secondary-light-grey"
                style={{
                  background:
                    "linear-gradient(to bottom right, white, color-mix(in srgb, var(--hotel-primary) 5%, white))",
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-hotel-primary/5 rounded-bl-full"></div>
                <div className="w-16 h-16 rounded-2xl bg-hotel-primary/10 flex items-center justify-center mb-6 text-hotel-primary group-hover:bg-hotel-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-xl text-hotel-primary-text mb-3 group-hover:text-hotel-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-hotel-secondary-grey leading-relaxed">
                  {item.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-hotel-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto text-center relative p-8 md:p-10 rounded-2xl shadow-xl overflow-hidden border border-hotel-primary/20"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--hotel-primary) 10%, white), color-mix(in srgb, var(--hotel-primary) 5%, white))",
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-hotel-primary/10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-hotel-primary/10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hotel-primary/10 mb-6 border-2 border-hotel-primary/20">
                <svg
                  className="w-8 h-8 text-hotel-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed text-hotel-primary-text">
                Your guests enjoy convenience from the moment they reach the
                venue.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
