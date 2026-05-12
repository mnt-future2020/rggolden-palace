import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div 
      className="p-8 md:p-10 lg:p-12 rounded-2xl shadow-lg h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--hotel-primary) 12%, white), color-mix(in srgb, var(--hotel-primary) 5%, white))' }}
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-serif mb-4 text-hotel-primary-text">
          Contact With Us
        </h2>
        <div className="w-20 h-1 bg-hotel-primary rounded-full mb-6"></div>
        <p className="text-hotel-secondary-grey leading-relaxed text-base">
          Whether you&apos;re planning a wedding, a grand event, or a special
          gathering, we&apos;re here to help you make it perfect. Connect with us
          today — let&apos;s bring your vision to life!
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        <div className="group flex items-center gap-4 p-4 rounded-xl bg-hotel-secondary-accent/60 hover:bg-hotel-secondary-accent transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-hotel-primary/10 flex items-center justify-center text-hotel-primary group-hover:bg-hotel-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs text-hotel-secondary-grey mb-1">Call Us</p>
            <p className="text-hotel-primary-text font-semibold text-lg">+91 6381150034</p>
          </div>
        </div>

        <div className="group flex items-center gap-4 p-4 rounded-xl bg-hotel-secondary-accent/60 hover:bg-hotel-secondary-accent transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-hotel-primary/10 flex items-center justify-center text-hotel-primary group-hover:bg-hotel-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs text-hotel-secondary-grey mb-1">Email Us</p>
            <p className="text-hotel-primary-text font-semibold break-all">garudas1975@gmail.com</p>
          </div>
        </div>

        <div className="group flex items-start gap-4 p-4 rounded-xl bg-hotel-secondary-accent/60 hover:bg-hotel-secondary-accent transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-hotel-primary/10 flex items-center justify-center text-hotel-primary group-hover:bg-hotel-primary group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-xs text-hotel-secondary-grey mb-2">Visit Us</p>
            <p className="text-hotel-primary-text font-semibold leading-relaxed">
              RG Golden Palace A/C,<br />
              Karaikudi – Dindigul Road,<br />
              Singampunari – 630 502,<br />
              Sivagangai District
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
