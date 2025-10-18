import React from "react";
import { FaShippingFast, FaHeadset, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-20">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">About Us</h1>
        <p className="text-gray-600 text-lg">
          We’re more than just a store — we’re your destination for quality,
          variety, and trust. From the latest fashion to everyday essentials,
          we bring it all under one roof.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
          <FaShippingFast className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">
            Get your orders quickly with our efficient and reliable delivery network.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
          <FaHeadset className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
          <p className="text-gray-600">
            Our support team is always ready to assist you with your needs.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
          <FaShieldAlt className="text-4xl text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Shopping</h3>
          <p className="text-gray-600">
            Shop confidently with our safe payment options and privacy protection.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 text-lg">
          To make shopping easy, enjoyable, and accessible for everyone — whether you're
          looking for fashion, electronics, home goods, or gifts. We believe in quality,
          affordability, and putting our customers first.
        </p>
      </div>
    </div>
  );
};

export default About;
