import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;

    // Handle case when input is empty (i.e., user is pressing backspace)
    if (value === '') {
      // Move focus to previous input
      if (index > 0) {
        (event.target.previousElementSibling as HTMLInputElement)?.focus();
      }
      // Update OTP state
      setOtp([...otp.map((d, idx) => (idx === index ? '' : d))]);
    } else if (!isNaN(parseInt(value))) {
      // Handle case when input is valid and has a value
      setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

      // Move focus to next input
      if (value && index < otp.length - 1) {
        (event.target.nextElementSibling as HTMLInputElement)?.focus();
      }
    }
  };

  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp.includes('')) {
      setError('Please enter all six digits of the OTP.');
      return;
    }
  
    try {
      console.log('Sending OTP to server:', otp.join(''));
      const response = await axios.post('http://localhost:5000/api/otp/verify-otp', { email, otp: otp.join('') });
      console.log('Server response:', response.data);
      if (response.data.success) {
        navigate('/welcome');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('OTP verification failed. Please try again.');
      console.error('OTP verification failed:', error);
    }
  };
  
  return (
    <div className="w-full max-w-md my-20 mx-auto bg-white shadow-md rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-600">Verify Your Email</h2>
        <p className="text-purple-400">
          We've sent a code to your email. Please enter it below.
        </p>
      </div>
      <div className="p-6">
        <label htmlFor="otp" className="block text-purple-600 mb-2">Enter OTP</label>
        <div className="flex justify-between">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={data}
              onChange={e => handleChange(e, index)}
              className="w-12 h-12 text-center text-purple-600 border border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          ))}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
      <div className="p-6 flex flex-col space-y-4">
        <button
          onClick={handleVerify}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        >
          Verify OTP
        </button>
      
      </div>
    </div>
  );
}
