import React, { useState } from "react";
import HighlightProducts from "../Components/Highliteproduct";

const Home = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const videos = [
    "/original-792b0e6a857fb25a9482fc045bb96399.mp4",
    "/large_2x.mp4",
    "/x4fa4f3ce9_large.mp4",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black-50">
      <section className="relative flex justify-center py-10">
        <div className="relative w-full max-w-7xl h-98 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl border border-gray-200 shadow-2xl">
          <video
            key={currentVideo} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={() => {
              setCurrentVideo((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
            }}
          >
            <source src={videos[currentVideo]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      <section className="bg-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            Essentials for the way you live
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the latest Apple innovations.
          </p>
        </div>
      </section>
      <HighlightProducts />
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
          <p>© 2025 Apple Store., Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
