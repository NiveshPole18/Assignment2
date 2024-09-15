// WelcomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Remove JWT token from local storage
    localStorage.removeItem('token');
    // Redirect to the sign-in page
    navigate('/signin');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default WelcomePage;
