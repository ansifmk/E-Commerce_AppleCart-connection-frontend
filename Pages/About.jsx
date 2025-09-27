import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
                  <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-gray-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            About Apple Store
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At Apple Store, we combine innovation, design, and technology to create 
            products that are both functional and beautiful. Our mission is to make 
            technology intuitive, accessible, and enjoyable for everyone.
          </p>
        </div>
        <div className="mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/60">
            <div className="h-64 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <img
                  src="https://www.apple.com/v/iphone-air/a/images/overview/design/hero_design__xv9gyjqhdiai_large_2x.jpg"
                  alt="Apple Design Showcase"
                  className="w-[5000px] h-[350px] mx-auto mb-4 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/60 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                Our Vision
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              We aim to provide an effortless shopping experience with the latest Apple 
              devices and accessories. Customer satisfaction, premium quality, and 
              simplicity are at the core of everything we do.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/60 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-800 bg-clip-text text-transparent">
                Why Shop With Us?
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Every product is handpicked to ensure top quality, backed by excellent 
              customer support. Whether you're exploring the latest iPhone, Mac, or 
              Apple Watch, our goal is to make your experience seamless and enjoyable.
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/60 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Our Values
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Innovation", 
                description: "We always strive to offer the newest technologies with cutting-edge design." 
              },
              { 
                icon: (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Customer Focus", 
                description: "Every decision we make prioritizes the customer experience." 
              },
              { 
                icon: (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Integrity", 
                description: "We ensure honesty, transparency, and reliability in all our dealings." 
              },
              { 
                icon: (
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Sustainability", 
                description: "We are committed to eco-friendly practices and reducing our carbon footprint." 
              },
              { 
                icon: (
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: "Excellence", 
                description: "Delivering premium-quality products and exceptional service is our standard." 
              },
              { 
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Innovation", 
                description: "Continuously pushing boundaries in technology and user experience." 
              }
            ].map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{value.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl shadow-2xl p-8 text-white mb-12">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Our Commitment</h2>
          </div>
          <p className="text-gray-200 leading-relaxed text-lg">
            We are dedicated to continuously improving the shopping experience for our 
            customers. From product selection to post-purchase support, we ensure that 
            every interaction with Apple Store is smooth, informative, and satisfying.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "10K+", label: "Happy Customers", icon: "👥" },
            { number: "5+", label: "Years Experience", icon: "📅" },
            { number: "100%", label: "Authentic Products", icon: "✅" },
            { number: "24/7", label: "Customer Support", icon: "📞" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;