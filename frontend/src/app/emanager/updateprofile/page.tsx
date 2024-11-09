"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import { withAuthProtection } from "@/app/utils/withAuthProtection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

// enum UserRole {
//   EVENT_MANAGER = "Event_Manager",
//   VOLUNTEER = "Volunteer",
//   SPONSOR = "Sponsor",
// }

interface User {
  name: string;
  username: string;
  userEmail: string;
  phoneNumber: string;
  // role: UserRole;
}

function UpdateProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    name: "",
    username: "",
    userEmail: "",
    phoneNumber: "",
    // role: UserRole.VOLUNTEER, // Default to Volunteer
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (user_id) {
          const response = await axios.get(
            `http://localhost:3000/user/byid/${user_id}`
          );
          // Add user_id to state and set fetched data
          setUser({ ...response.data, user_id });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile");
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const user_id = localStorage.getItem("user_id");
  //     if (user_id) {
  //       // Only include properties that are expected by UpdateUserDto
  //       const updateData = {
  //         name: user.name,
  //         username: user.username,
  //         userEmail: user.userEmail,
  //         phoneNumber: user.phoneNumber,
  //       //   role: user.role
  //       };

  //       const response = await axios.put(`http://localhost:3000/user/${user_id}`, updateData);

  //       console.log("API Response:", response.data);
  //       toast.success("Profile updated successfully");
  //       router.push("/emanager/userdetails");
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Axios error:", error.response?.data || error.message);
  //       toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
  //     } else {
  //       console.error("Error updating profile:", error);
  //       toast.error("Failed to update profile: Unknown error");
  //     }
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user_id = localStorage.getItem("user_id");
      if (user_id) {
        // Only include properties that are expected by UpdateUserDto
        const updateData = {
          name: user.name,
          username: user.username,
          userEmail: user.userEmail,
          phoneNumber: user.phoneNumber,
        };

        const response = await axios.put(
          `http://localhost:3000/user/${user_id}`,
          updateData
        );

        console.log("API Response:", response.data);
        toast.success("Profile updated successfully");
        router.push("/emanager/userdetails");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          // If the conflict status is received (username already taken)
          toast.error("Username is already taken");
        } else {
          console.error("Axios error:", error.response?.data || error.message);
          toast.error(`Failed to update profile: ${error.response?.data?.message || error.message}`);
        }
      } else {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile: Unknown error");
      }
    }
  };


  return (
    <>
      {/* Toast Notification */}
      <Toaster position="bottom-right" />
      <Sidebar />
      <div className="p-4 my-8 sm:ml-64">
        <div className="p-4 my-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden bg-white border rounded-lg shadow-lg">
              <div className="px-6 py-5 sm:px-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  My Profile
                </h3>
              </div>
              <div className="px-6 py-5 border-t border-gray-200 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {/* Name Input */}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        name="name"
                        value={user?.name || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your name"
                      />
                    </dd>
                  </div>

                  {/* Username Input */}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        name="username"
                        value={user?.username || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your username"
                      />
                    </dd>
                  </div>

                  {/* Email Input */}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="email"
                        name="userEmail"
                        value={user?.userEmail || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your email"
                      />
                    </dd>
                  </div>

                  {/* Phone Number Input */}
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone Number
                    </dt>
                    <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        name="phoneNumber"
                        value={user?.phoneNumber || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your phone number"
                      />
                    </dd>
                  </div>

                  {/* Role Selection */}
                  {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                      <select
                        name="role"
                        value={user?.role || UserRole.VOLUNTEER}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={UserRole.EVENT_MANAGER}>
                          Event Manager
                        </option>
                        <option value={UserRole.VOLUNTEER}>Volunteer</option>
                        <option value={UserRole.SPONSOR}>Sponsor</option>
                      </select>
                    </dd>
                  </div> */}
                </dl>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />

                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default withAuthProtection(UpdateProfile);
