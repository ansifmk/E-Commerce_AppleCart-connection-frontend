import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HighlightProducts from "../Components/Highliteproduct";

const Home = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [leftProgress, setLeftProgress] = useState(0);
  const [rightProgress, setRightProgress] = useState(0);
  const navigate = useNavigate();

  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  // ✅ CHANGED: videos array → videoData with title + subtitle
  const videoData = [
    {
      src: "/Introducing iPhone 17 Pro.mp4",
      title: "",
      subtitle: "",
    },
    {
      src: "/3D Product Animation Headphones Blender.mp4",
      title: "AirPods Max 2",
      subtitle: "Sound that surrounds you.",
    },
    {
      src: "/original-792b0e6a857fb25a9482fc045bb96399.mp4",
      title: "EarBuds",
      subtitle: "Power meets elegance.",
    },

    // {
    //   src: "/large_2x.mp4",
    //   title: "iPhone 17 Pro",
    //   subtitle: "A camera that captures every moment.",
    // },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      [
        { ref: leftCardRef, setter: setLeftProgress },
        { ref: rightCardRef, setter: setRightProgress },
      ].forEach(({ ref, setter }) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const progress = Math.min(
          Math.max((windowHeight - rect.top) / (windowHeight * 0.6), 0),
          1,
        );
        setter(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black-50 overflow-x-hidden">
      {/* ── Hero Banner Grid ── */}
      <section className="py-4 px-4 bg-[#f5f5f7]">
        <div className="w-full flex flex-col gap-3 px-4">
          {/* Row 1 — Full width card */}
          <div className="relative bg-black rounded-2xl overflow-hidden flex flex-col md:flex-row items-center min-h-[610px] w-full group px-8 md:px-16 py-12 md:py-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* LEFT — Text */}
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3 md:pr-4">
              <h2 className="animate-fade-slide-down text-5xl md:text-6xl font-semibold text-white mb-3 leading-tight">
                iPhone
              </h2>
              <p className="animate-fade-slide-down-1 text-base md:text-lg text-gray-400 mb-8 max-w-xs">
                Meet the latest iPhone lineup.
              </p>
              <div className="animate-fade-slide-down-2 flex flex-wrap gap-3 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/products")}
                  className="text-sm px-6 py-2.5 rounded-full font-medium bg-white text-black
                             hover:bg-gray-200 hover:scale-105 active:scale-95
                             transition-all duration-300 cursor-pointer"
                >
                  Shop iPhone
                </button>
              </div>
            </div>

            {/* RIGHT — Image */}
            <div className="animate-fade-slide-up relative z-10 w-full md:w-2/3 flex items-center justify-center mt-6 md:mt-0">
              <img
                src="/image-22.webp"
                alt="iPhone"
                className="object-contain w-full transition-transform duration-700 group-hover:scale-105 drop-shadow-2xl"
                style={{ maxHeight: "700px", height: "70vh" }}
              />
            </div>
          </div>

          {/* Row 2 — Two cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card 2 — MacBook Neo — scroll-driven from LEFT */}
            <div
              ref={leftCardRef}
              style={{
                opacity: leftProgress,
                transform: `translateX(${-100 + leftProgress * 100}px)`,
                willChange: "transform, opacity",
              }}
              className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-start items-center text-center group"
            >
              <video
                className="absolute top-0 left-0 w-full h-full object-cover scale-115
                           group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/The all-new MacBook Neo.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="relative z-10 pt-10 px-6 flex flex-col items-center text-center">
                <h2 className="text-3xl font-semibold text-black mb-2">
                  MacBook Neo
                </h2>
                <p className="text-base text-gray-900 mb-6">
                  Amazing Mac. Surprising Price.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="text-sm px-5 py-2 rounded-full font-medium bg-black text-white
                             hover:bg-gray-700 hover:scale-105 active:scale-95
                             transition-all duration-300 cursor-pointer"
                >
                  Shop MacBook Neo
                </button>
              </div>
            </div>

            {/* Card 3 — Apple Watch — scroll-driven from RIGHT */}
            <div
              ref={rightCardRef}
              style={{
                opacity: rightProgress,
                transform: `translateX(${100 - rightProgress * 100}px)`,
                willChange: "transform, opacity",
              }}
              className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col items-center text-center group"
            >
              <video
                className="absolute top-0 left-0 w-full h-full object-cover scale-106
                           group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="/Introducing Apple Watch Series 11.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="relative z-10 pt-10 px-6 flex flex-col items-center text-center">
                <h2 className="text-3xl font-semibold text-black mb-2">
                  WATCH SERIES 11
                </h2>
                <p className="text-base text-gray-900 mb-6">
                  The ultimate way to watch your health.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="text-sm px-5 py-2 rounded-full font-medium bg-black text-white
                             hover:bg-gray-700 hover:scale-105 active:scale-95
                             transition-all duration-300 cursor-pointer"
                >
                  Shop Apple Watch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative flex justify-center py-10 px-4">
        <div className="animate-fade-slide-up-2 relative w-full max-w-7xl md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl border border-gray-200 shadow-2xl group">
          <video
            key={currentVideo}
            className="absolute top-0 left-0 w-full h-full object-cover scale-105
                       group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            autoPlay
            muted
            playsInline
            onEnded={() =>
              setCurrentVideo((prev) =>
                prev < videoData.length - 1 ? prev + 1 : 0,
              )
            }
          >
            {/* ✅ CHANGED: src from videos[i] → videoData[i].src */}
            <source src={videoData[currentVideo].src} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700" />

          {/* ✅ CHANGED: key={currentVideo} forces re-animation on video change */}
          <div
            key={currentVideo}
            className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-32 md:py-0"
          >
            <h1 className="animate-fade-slide-down text-4xl md:text-6xl font-semibold text-white mb-4">
              {/* ✅ CHANGED: hardcoded text → dynamic from videoData */}
              {videoData[currentVideo].title}
            </h1>
            <p className="animate-fade-slide-down-1 text-lg md:text-xl text-gray-200 mb-6">
              {/* ✅ CHANGED: hardcoded text → dynamic from videoData */}
              {videoData[currentVideo].subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Essentials Section */}
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
    </div>
  );
};

export default Home;
