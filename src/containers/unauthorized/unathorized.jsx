import React from "react";
import { Link } from "react-router-dom";
import Button from "../../atoms/button/button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-primary text-white p-10 flex flex-col justify-center">
            <p className="text-sm uppercase tracking-widest text-white/80">
              Access denied
            </p>
            <h1 className="text-5xl font-extrabold mt-3">403</h1>
            <p className="mt-4 text-white/90">
              You do not have permission to view this page. If you think this is
              a mistake, please contact your administrator.
            </p>
            <div className="mt-8 hidden md:flex">
              <svg
                className="w-40 h-40 text-white/20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a5 5 0 015 5v2h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5zm3 7V7a3 3 0 00-6 0v2h6z" />
              </svg>
            </div>
          </div>
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Your role does not allow access
            </h2>
            <p className="mt-3 text-gray-600">
              Try one of the options below to continue using the system.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/dashboard">
                <Button color="primary" size="md">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" color="secondary" size="md">
                  Back to Login
                </Button>
              </Link>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
