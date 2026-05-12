import React from "react";

const Map = () => {
  return (
    <div className="w-full h-[350px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d582.2730665338347!2d78.4390994!3d10.1816604!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00ebb9bb4f3ead%3A0xe480bc428c4d847b!2sR%20G%20Golden%20Palace!5e1!3m2!1sen!2sin!4v1764850479963!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="RG Golden Palace - Singampunari, Sivagangai District"
      ></iframe>
    </div>
  );
};

export default Map;
