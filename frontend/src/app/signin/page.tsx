
"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FormData {
  username: string;
  password: string;
}

export default function SigninPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      const userRole = response.data.user.role; // User role from the response

      const roleRoutes: { [key: string]: string } = {
        'Volunteer': '/volunteer/dashboard',
        'Event_Manager': '/emanager/dashboard',
        'Sponsor': '/sponsor-dashboard'
      };

      const route = roleRoutes[userRole];
      if (route) {
        const token = response.data.access_token; // JWT token
        localStorage.setItem('token', token);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('user_id', response.data.user.id); // Save user ID

        toast.success('Sign in successful');
        router.push(route);
      } else {
        toast.error('User role not recognized.');
      }

    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Sign in failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Header />
      <Toaster /> {/* For showing toaster notifications */}
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-2xl font-bold text-center text-black dark:text-white sm:text-3xl">
                  Sign in your account
                </h3>
                <p className="text-base font-medium text-center mb-11 text-body-color">
                  Login to your account for a faster checkout.
                </p>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="username"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      autoComplete="username"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="block mb-3 text-sm text-dark dark:text-white"
                    >
                      Your Password
                    </label>
                    <input
                      id="password"
                      autoComplete="current-password"
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  <div className="mb-6">
                    <button className="flex items-center justify-center w-full py-4 text-base font-medium text-white duration-300 rounded-sm shadow-submit dark:shadow-submit-dark bg-primary px-9 hover:bg-primary/90">
                      Sign in
                    </button>
                  </div>
                </form>
                <br />

                <p className="text-base font-medium text-center text-body-color">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 z-[-1]">
          {/* Background SVG */}
        </div>
      </section>
      <Footer />
    </>
  );
}
