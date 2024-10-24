"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { escape } from "querystring";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface FormData {
  name: string;
  username: string;
  userEmail: string;
  password: string;
  role: string;
  phoneNumber: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    userEmail: "",
    password: "",
    role: "Event Manager", // Default role
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };

  // Form validation function
  const validateForm = (formData: FormData): Partial<FormData> => {
    const validationErrors: Partial<FormData> = {};

    // Validate name
    if (!formData.name) {
      validationErrors.name = "Name is required";
    }

    // Validate username (must contain a special character and a number)
    if (!formData.username) {
      validationErrors.username = "Username is required";
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.username)) {
      validationErrors.username = "Username must contain at least one number and one special character";
    }

    // Validate email
    if (!formData.userEmail) {
      validationErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      validationErrors.userEmail = "Invalid email format";
    }

    // Validate password (must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long)
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (
      !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password) ||
      formData.password.length < 8
    ) {
      validationErrors.password = "Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long";
    }

    // Validate phone number (must be exactly 11 digits)
    if (!formData.phoneNumber) {
      validationErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number must be exactly 11 digits";
    }


    return validationErrors;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Send a POST request to the backend
        const response = await axios.post("http://localhost:3000/auth/register", formData);

        if (response.status === 201) {
          toast.success("User added successfully!");
          // Redirect the user to a specific page, e.g., login
          router.push("/signup");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          // Handle conflict error (e.g., user already exists)
          toast.error(error.response.data.message); // Show error message from backend
        } else {
          // Handle any other errors
          toast.error("Registration failed. Please try again.");
        }
      }
    } else {
      // Set validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-2xl font-bold text-center text-black dark:text-white sm:text-3xl">
                  Sign up to your account
                </h3>
                <p className="text-base font-medium text-center mb-11 text-body-color">
                  It’s totally free and super easy
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="username"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.username && <p className="text-red-500">{errors.username}</p>}
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="userEmail"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      id="userEmail"
                      type="email"
                      name="userEmail"
                      placeholder="Enter your email"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.userEmail && <p className="text-red-500">{errors.userEmail}</p>}
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="phoneNumber"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                    {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="role"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    >
                      {/* <option value="Admin">Admin</option> */}
                      <option value="Event_Manager">Event Manager</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Sponsor">Sponsor</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Sign up
                    </button>
                  </div>
                </form>

                <p className="text-base text-body-color">
                  Already have an account?
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />

    </>
  );
}
