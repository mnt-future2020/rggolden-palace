"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const hallImages = [
  {
    src: "/hall/mahal-dinning.jpeg",
    alt: "Luxury banquet hall with elegant dining setup and purple lighting",
    title: "Grand Dining Hall"
  },
  {
    src: "/hall/mahal-auditorium.jpeg",
    alt: "Luxury banquet hall auditorium with elegant stage and seating",
    title: "Main Auditorium"
  },
  {
    src: "/hall/mahal-hall.jpeg",
    alt: "Spacious banquet hall with round table setup",
    title: "Classic Hall Setup"
  },
  {
    src: "/hall/mahal-outside.jpeg",
    alt: "Luxury banquet hall exterior with elegant lighting at night",
    title: "Exterior View"
  },
  {
    src: "/hall/mahal-wall-lighting.jpeg",
    alt: "Elegant ceiling with crystal chandeliers and purple lighting",
    title: "Premium Lighting"
  }
];

export default function HallGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-hotel-primary/5 blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-hotel-primary/5 blur-3xl translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-hotel-primary font-medium text-sm uppercase tracking-wider mb-2 inline-block">
            EXPLORE OUR VENUE
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 text-hotel-primary-text">
            Hall Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-hotel-primary to-hotel-primary/50 mx-auto mb-6 rounded-full"></div>
          <p className="text-hotel-secondary-grey max-w-2xl mx-auto text-lg">
            Take a visual tour of our stunning banquet halls and facilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hallImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-xl font-serif mb-2">{image.title}</h3>
                <div className="w-0 h-0.5 bg-hotel-primary group-hover:w-16 transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-white text-2xl font-serif">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
