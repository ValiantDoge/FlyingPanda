import { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';



const Login = () => {
    // Auth state 
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    // User Login form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "api/auth/sign-in", 
                formData, 
                {   
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            
           // Set auth state and persist tokens
            const authData = {
                user: response.data.data.user,
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
            };
            
            setAuth(authData);
            toast.success("Successfully logged in!")

            // Redirect to protected route
            navigate("/", { replace: true });
        } catch (error) {
           toast.error(error.response.data.error);
            return;
            
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-center mt-6 text-4xl font-bold">Flying Panda</h1>
          <h2 className="mt-2 text-center text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleChange}
                name="email"
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
