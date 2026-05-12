"use client";

import { FaSignOutAlt, FaUser } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardHeaderSkeleton from "./DashboardHeaderSkeleton";
import { handleLogout } from "../../utils/auth/logout"

const DashboardHeader = ({ headerName }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
    } catch (error) {
      console.error("Logout failed:", error)
      router.replace("/login")
    }
  }

  // Function to get user initials based on role
  const getUserInitial = () => {
    if (!session?.user) return "U"; // Default to "U" for User
    
    if (session.user.isEmployee) {
      // For employees, show first letter of their role
      return session.user.role ? session.user.role.charAt(0).toUpperCase() : "E";
    } else {
      // For admin, show "A"
      return "A";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch hotel data
        const hotelResponse = await axios.get(`/api/hotelDetails`);
        if (hotelResponse.data.success) {
          setHotelData(hotelResponse.data.hotelData);
        } else {
          throw new Error(hotelResponse.data.message || "Failed to fetch hotel data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load hotel data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <DashboardHeaderSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
      <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
        {headerName || hotelData?.hotelName}
      </h1>
      <div className="flex items-center space-x-4">
        {/* <button className="border p-2 rounded-full">
          <FaBell className="h-4 w-4" />
        </button> */}
        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            {/* Avatar with initials based on role */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-hotel-primary flex items-center justify-center text-white font-semibold text-sm md:text-base">
              {getUserInitial()}
            </div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.isEmployee ? session.user.role : "Mahal Admin"}
                </p>
              </div>
              <Link href="/dashboard/profile">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaUser className="inline mr-2" /> Profile
                </button>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;