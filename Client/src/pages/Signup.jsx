import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import EmailConfirmationModal from "./EmailConfirmationModal.jsx";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(3),
  email: yup.string().email("Invalid email").required("Email is required"),
  age: yup.number().positive().integer().required("Age is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [pendingUserData, setPendingUserData] = useState(null);
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
      await axios.post("http://localhost:3000/confirm-email/send", {
        email: data.email,
      });

      setRegisteredEmail(data.email);
      setPendingUserData(data);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/signup",
        pendingUserData
      );
      toast.success("Account created successfully! You can now log in.");
      setShowModal(false);
      navigate("/login");
    } catch (err) {
      console.error(err)
      toast.error("Account creation failed after verification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className={`w-full px-4 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <input
              {...register("age")}
              type="number"
              placeholder="Age"
              className={`w-full px-4 py-2 border ${
                errors.age ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.age && (
              <p className="text-sm text-red-500 mt-1">
                {errors.age.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <NavLink to="/login">
          <span className="flex justify-center mt-4 text-blue-500 hover:underline">
            Already have an account? Login
          </span>
        </NavLink>
      </div>

      {/* Modal */}
      {showModal && (
        <EmailConfirmationModal
          email={registeredEmail}
          onVerified={handleVerificationSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
// import { NavLink, useNavigate } from "react-router-dom";
// import EmailConfirmationModal from "../components/confirmModal";
// import { toast } from "react-toastify";
// import { Button, CircularProgress } from "@mui/material";

// // ✅ Validation Schema
// const schema = yup.object().shape({
//   username: yup.string().required("Username is required").min(3, "At least 3 characters"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   age: yup.number().positive().integer().required("Age is required"),
//   password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
// });

// const Signup = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");
//   const [pendingUserData, setPendingUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(schema) });

//   // ✅ Step 1: Send verification email
//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:3000/confirm-email/send", {
//         email: data.email,
//       });
//       setRegisteredEmail(data.email);
//       setPendingUserData(data);
//       setShowModal(true);
//       toast.info("Verification email sent! Please check your inbox.");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to send verification email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Step 2: After verification success → create user
//   const handleVerificationSuccess = async () => {
//     try {
//       await axios.post("http://localhost:3000/auth/signup", pendingUserData);
//       toast.success("Account created successfully! 🎉");
//       setShowModal(false);
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       toast.error("Account creation failed after verification");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//       <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%] bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
//         <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Create Account</h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           {/* Username */}
//           <div>
//             <input
//               {...register("username")}
//               placeholder="Username"
//               className={`w-full px-4 py-2 border ${
//                 errors.username ? "border-red-500" : "border-gray-300"
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//             />
//             {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>}
//           </div>

//           {/* Email */}
//           <div>
//             <input
//               {...register("email")}
//               type="email"
//               placeholder="Email"
//               className={`w-full px-4 py-2 border ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//             />
//             {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
//           </div>

//           {/* Age */}
//           <div>
//             <input
//               {...register("age")}
//               type="number"
//               placeholder="Age"
//               className={`w-full px-4 py-2 border ${
//                 errors.age ? "border-red-500" : "border-gray-300"
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//             />
//             {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
//           </div>

//           {/* Password */}
//           <div>
//             <input
//               {...register("password")}
//               type="password"
//               placeholder="Password"
//               className={`w-full px-4 py-2 border ${
//                 errors.password ? "border-red-500" : "border-gray-300"
//               } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
//             />
//             {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             disabled={loading}
//             variant="contained"
//             fullWidth
//             sx={{ py: 1.2, fontSize: "1rem" }}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
//           </Button>

//           {/* Login Link */}
//           <NavLink to="/login" className="block text-center text-blue-500 mt-2 hover:underline">
//             Already have an account? Login
//           </NavLink>
//         </form>

//         {/* Email Confirmation Modal */}
//         {showModal && (
//           <EmailConfirmationModal
//             email={registeredEmail}
//             onVerified={handleVerificationSuccess}
//             onClose={() => setShowModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;
