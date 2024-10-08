import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
// import axoise from '../axios'
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import SignInImage from '../assets/Picture2.png';

export default function SignInPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate('/signup');
      };
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
       // Initialize navigate
    
        try {
            console.log('Form data being sent:', formData); // Verify structure
    
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log('Login success:', response.data);
    
            navigate('/welcome'); // Navigate to welcome page
    
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error('Login failed:', axiosError.response?.data || axiosError.message);
            } else {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred');
            }
        }
    };
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex items-center justify-center">
                <img
                    src={SignInImage}
                    alt="Office illustration"
                    className="ml-10 w-[900px] h-[670px]"
                />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8 px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-purple-900">
                            Let us know<span className="text-red-500">!</span>
                        </h2>
                    </div>
                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                                <Eye
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer h-5 w-5"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-900 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Sign In
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleNavigation}
                                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-purple-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
