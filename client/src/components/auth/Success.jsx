import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleGoToCourses = () => {
    navigate('/my-courses');
  };

  return (
    <div className="flex flex-col items-center justify-center py-36 bg-[#001313] px-4">
      <h1 className="text-3xl my-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent">Purchase Successful!</h1>
      <p className='mb-4 text-gray-200'>You got one step closer to your goalllll..😻👏🏻</p>
      <div className="w-full">
        <iframe
          src="https://giphy.com/embed/t3sZxY5zS5B0z5zMIz"
          width="100%"
          height="100%"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
      </div>
      <button
        onClick={handleGoToCourses}
        className="mt-6 px-4 py-2 block w-full rounded-full border border-green-300 text-sm font-medium text-white hover:text-black hover:bg-green-300 focus:outline-none focus:ring sm:w-auto"
      >
        Go to your courses 
      </button>
    </div>
  );
};

export default Success;
