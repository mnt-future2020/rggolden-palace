"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Check } from "lucide-react";
import BookingModal from "./BookingModal";

function VenueCard({
  mainImage,
  name,
  pricing,
  amenities,
  size,
  capacity,
  services = [],
}) {
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const amenitiesText =
    amenities?.map((a) => a.name).join(" | ") || "No amenities";
  const capacityText = `Capacity: ${capacity ?? "N/A"} guests | Size: ${
    size ?? "N/A"
  } sq.ft`;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="h-48 md:h-56 overflow-hidden relative">
        <Image
          src={mainImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">{name}</h3>
          <span className="text-sm text-gray-600">
            Price: ₹
            {pricing?.propertyTypePricing?.hall?.originalPrice ||
              pricing?.basePrice}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-sm text-gray-600 flex-1 ${
                amenitiesExpanded ? "" : "truncate"
              }`}
              title={amenitiesText}
            >
              {amenitiesText}
            </p>

            {(Array.isArray(amenities) && amenities.length > 2) ||
            amenitiesText.length > 40 ? (
              <button
                onClick={() => setAmenitiesExpanded((s) => !s)}
                className="text-sm text-hotel-primary ml-3 whitespace-nowrap"
                aria-expanded={amenitiesExpanded}
              >
                {amenitiesExpanded ? "Hide" : "View"}
              </button>
            ) : null}
          </div>

          <p className="text-sm font-medium">Features</p>

          <p className="text-sm text-gray-600">{capacityText}</p>

          {/* Services Section */}
          {services && services.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800">
                  Available Services
                </p>
                <button
                  onClick={() => setServicesExpanded((s) => !s)}
                  className="text-xs text-hotel-primary"
                >
                  {servicesExpanded ? "Hide" : "View"}
                </button>
              </div>
              <div
                className={`space-y-2 ${
                  servicesExpanded ? "" : "max-h-20 overflow-hidden"
                }`}
              >
                {services.map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-hotel-primary flex-shrink-0" />
                    <span className="text-gray-700">{service.name}</span>
                    <span className="text-hotel-primary font-semibold ml-auto">
                      ₹{service.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelFacilities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayHalls, setDisplayHalls] = useState([]);
  const [services, setServices] = useState([]);

  // Determine grid columns based on item count
  const getGridColsClass = () => {
    const count = displayHalls.length;
    if (count === 2) return "lg:grid-cols-2";
    if (count === 3) return "lg:grid-cols-3";
    if (count >= 4) return "lg:grid-cols-3";
    return "lg:grid-cols-1";
  };

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get("/api/rooms");
        if (response.data.success) {
          const allHalls = response.data.rooms.filter(
            (room) => room.type === "hall"
          );
          const shuffled = [...allHalls].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3);
          setDisplayHalls(selected);
        }
      } catch (error) {
        console.error("Error fetching halls:", error);
      }
    };
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/settings/rooms");
        setServices(response.data.settings?.services || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-serif text-center mb-3">
            Elegant Halls{" "}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-hotel-primary to-hotel-primary/50 mb-6 rounded-full mx-auto"></div>
          <p className="text-sm sm:text-base text-gray-600">
            From grand weddings to intimate gathering.{" "}
          </p>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${getGridColsClass()} gap-8`}
        >
          {displayHalls.map((hall, index) => (
            <Link href="/hall" key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VenueCard {...hall} services={services} />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
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
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export { VenueCard };
