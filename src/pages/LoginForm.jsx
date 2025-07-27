import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import BgImage from "../assets/BgImage.jpeg";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const showAlert = (message, type = "success") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 9000);
  };

  const dismissAlert = () => {
    setAlert({ message: "", type: "", visible: false });
  };

  const onSubmit = async (data) => {
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        await updateProfile(userCredential.user, {
          displayName: data.fullName,
        });
        showAlert("Account created successfully!", "success");
        navigate("/home");
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        showAlert("Logged in successfully!", "success");
        navigate("/home");
      }
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="absolute inset-0 bg-opacity-60 z-0"></div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 p-10 rounded-xl shadow-2xl w-full max-w-md md:max-w-lg lg:max-w-xl animate-fade-in"
        style={{
          backgroundColor: "#0a0f24",
          color: "#d3d3d3",
        }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#1e90ff" }}>
          {isSignup ? "Create Account" : "Login"}
        </h2>

        {alert.visible && (
          <div
            className={`mb-4 p-3 rounded text-sm text-center relative transition-opacity duration-500 ${
              alert.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            <span className="mr-2">
              {alert.type === "success" ? "✅" : "❌"}
            </span>
            {alert.message}
            <button
              onClick={dismissAlert}
              className="absolute top-1 right-3 text-white text-lg font-bold hover:text-gray-300"
            >
              ×
            </button>
          </div>
        )}

        {isSignup && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full p-3 border border-blue-500 rounded bg-transparent text-d3d3d3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full p-3 border border-blue-500 rounded bg-transparent text-d3d3d3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full p-3 border border-blue-500 rounded bg-transparent text-d3d3d3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
          style={{ boxShadow: "0 0 10px #1e90ff" }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-300">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-300 underline hover:text-blue-500"
          >
            {isSignup ? "Login" : "Create an account"}
          </button>
        </p>
      </form>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
