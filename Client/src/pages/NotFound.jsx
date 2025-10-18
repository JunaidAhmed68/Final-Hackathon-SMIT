import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-6xl font-extrabold text-blue-600 animate-bounce">404</h1>
      <p className="text-2xl font-semibold mt-4">Oops! Page not found</p>
      <p className="text-gray-600 mt-2 mb-6 text-center max-w-md">
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
