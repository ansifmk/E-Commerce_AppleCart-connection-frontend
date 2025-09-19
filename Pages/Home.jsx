import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";
import Products from "../Components/Highliteproduct";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    "/large_2x.mp4",      // first video
    "/original-792b0e6a857fb25a9482fc045bb96399.mp4",  // second video
    "/x4fa4f3ce9_large.mp4",
        // add more if you want
  ];
  return (
    <div className="min-h-screen flex flex-col bg-black-50">
      <section className="relative bg-black-100 flex justify-center py-10">
      <div className="relative w-full max-w-7xl h-98 md:h-[500px] lg:h-[600px] overflow-hidden 
                      rounded-2xl border border-gray-200 shadow-2xl">
        <video
          key={currentVideo} // re-render when video changes
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onEnded={() => {
            if (currentVideo < videos.length - 1) {
              setCurrentVideo(currentVideo + 1); // next video
            } else {
              setCurrentVideo(0); // back to first video
            }
          }}
        >
          <source src={videos[currentVideo]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
      {/* Hero Section */}
      <section className="bg-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h1 className="text-5xl font-light text-gray-900 mb-4">
              Essentials for the way you live
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Welcome back, {user?.name || "Guest"}! Discover the latest Apple
              innovations.
            </p>
          </div>
        </div>
      </section>

     
      <Products />

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Apple Store., Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
