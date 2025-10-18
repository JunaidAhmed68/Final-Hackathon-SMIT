// import * as yup from "yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { useContext, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// export default function Login() {
//   const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);

//   const schema = yup.object({
//     email: yup
//       .string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     password: yup
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const submitButton = async (formData) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(


//         "http://localhost:3000/auth/login",
//         formData
//       );

//       const { user, token } = response.data;
//       Cookies.set("token", token);
//       setUser(user);
//       toast.success("Login successful!");
//       navigate("/");
//     } catch (error) {
//       const msg = error.response?.data?.message || "Login failed";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//       <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-xl rounded-xl border border-gray-100">
//         <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
//           Login to Your Account
//         </h2>

//         <form onSubmit={handleSubmit(submitButton)} className="space-y-6">
//           {/* Email */}
//           <div>
//             <label className="block mb-1 font-medium text-sm text-gray-700">
//               Email Address
//             </label>
//             <input
//               {...register("email")}
//               type="email"
//               className={`w-full px-4 py-2 border ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               placeholder="you@example.com"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 font-medium text-sm text-gray-700">
//               Password
//             </label>
//             <input
//               {...register("password")}
//               type="password"
//               className={`w-full px-4 py-2 border ${
//                 errors.password ? "border-red-500" : "border-gray-300"
//               } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               placeholder="••••••••"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
//               loading
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Signing In..." : "Login"}
//           </button>

//           <Link to="/forgotpassword">
//             <p className="flex justify-center mt-2 mb-2 text-blue-400 hover:text-blue-700">
//               Forgot Password?
//             </p>
//           </Link>
//           <span className="flex justify-center">OR</span>
//         </form>

//         <NavLink to="/signup">
//           <span className="flex justify-center mt-2 text-blue-400 hover:text-blue-700">
//             Don't have an account? Signup
//           </span>
//         </NavLink>
//       </div>
//     </div>
//   );
// }
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/auth/login", data);
      const { user, token } = res.data;

      // ✅ Store token in cookies instead of localStorage
      Cookies.set("token", token, { expires: 7 }); // lasts 7 days

      setUser(user);
      toast.success("Login successful!");

      // ✅ Redirect to dashboard after login
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <Button type="submit" disabled={loading} variant="contained" fullWidth>
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Links */}
          <NavLink
            to="/forgotpassword"
            className="block text-center text-blue-500 mt-2"
          >
            Forgot Password?
          </NavLink>
          <NavLink
            to="/signup"
            className="block text-center text-blue-500 mt-2"
          >
            Sign Up
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
