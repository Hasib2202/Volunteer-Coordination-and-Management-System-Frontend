"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "@/components/Sidebar/Sidebar";
import { withAuthProtection } from "@/app/utils/withAuthProtection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSync } from "@fortawesome/free-solid-svg-icons";

enum UserStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
}

enum UserRole {
    EVENT_MANAGER = 'Event_Manager',
    VOLUNTEER = 'Volunteer',
    SPONSOR = 'Sponsor',
}

interface User {
    id: number;
    name: string;
    username: string;
    userEmail: string;
    phoneNumber: string;
    role: UserRole;
    isActive: UserStatus;
}

// interface UserUpdate {
//     name: string;
//     userEmail: string;
//     phoneNumber: string;
//     role: UserRole; // Exclude sensitive properties
// }

function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});

    const fetchData = async () => {
        try {
            const user_id = localStorage.getItem("user_id");
            if (user_id) {
                const response = await axios.get<User>(
                    `http://localhost:3000/user/byid/${user_id}`
                );
                setUser(response.data);
                setFormData(response.data);
            } else {
                toast.error("User ID not found");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Error fetching profile");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
        toast.success("Information refreshed");
    };

    const handleStatusUpdate = async (newStatus: UserStatus) => {
        if (user && user.isActive !== newStatus) {
            try {
                const response = await axios.patch<User>(
                    `http://localhost:3000/user/status/${user.id}`,
                    {
                        isActive: newStatus,
                    }
                );
                setUser(response.data);
                toast.success(`Status updated to ${newStatus}`);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Error updating status");
            } finally {
                setIsModalOpen(false);
            }
        } else {
            toast.error("Status is already set to the selected value");
        }
    };

    // const handleInputChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    // ) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({ ...prevData, [name]: value }));
    // };

    // const handleUpdateInfo = async () => {
    //     if (user) {
    //         try {
    //             if (!formData.name || !formData.userEmail || !formData.phoneNumber) {
    //                 toast.error("Please fill out all fields correctly.");
    //                 return;
    //             }

    //             // Send the update request
    //             const response = await axios.put<UserUpdate>(
    //                 `http://localhost:3000/user/${user.id}`,
    //                 formData
    //             );

    //             // Update the user state directly from response
    //             setUser((prevUser) => ({ ...prevUser, ...response.data }));

    //             toast.success("Information updated successfully!");
    //         } catch (error) {
    //             console.error("Error updating information:", error);
    //             if (axios.isAxiosError(error) && error.response) {
    //                 const errorMessage = error.response.data.message || "Error updating information";
    //                 toast.error(errorMessage);
    //             } else {
    //                 toast.error("Error updating information");
    //             }
    //         } finally {
    //             setIsUpdateModalOpen(false);
    //         }
    //     }
    // };




    return (
        <>
            <Sidebar />
            <Toaster position="bottom-right" />

            <form onSubmit={handleRefresh}>
                <div className="p-4 my-8 sm:ml-64">
                    <div className="p-4 my-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        <div className="overflow-hidden bg-white border rounded-lg shadow">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    User details
                                </h3>
                            </div>
                            <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    {/* Profile Data Display */}
                                    {[
                                        { label: "Id", value: user?.id },
                                        { label: "Name", value: user?.name },
                                        { label: "Username", value: user?.username },
                                        { label: "User email", value: user?.userEmail },
                                        { label: "Phone number", value: user?.phoneNumber },
                                        { label: "Role", value: user?.role },
                                        { label: "Status", value: user?.isActive },
                                    ].map((field) => (
                                        <div
                                            className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                                            key={field.label}
                                        >
                                            <dt className="text-sm font-medium text-gray-500">
                                                {field.label}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {field.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 justify-left">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 text-white bg-green-500 rounded"
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />

                            Update Status
                        </button>
                        {/* <button
                            type="button"
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="p-2 text-white bg-purple-500 rounded"
                        >
                            Update Information
                        </button> */}
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="p-2 text-white bg-blue-500 rounded"
                        >
                            <FontAwesomeIcon icon={faSync} className="mr-2" />
                            Refresh Information
                        </button>
                    </div>
                </div>
            </form>

            {/* Modal for Status Update */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                    <div className="p-6 transition duration-300 ease-out transform bg-white rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold">Update Status</h2>
                        <div className="mt-4 space-x-4">
                            <button
                                className="px-4 py-2 text-white bg-green-500 rounded"
                                onClick={() => handleStatusUpdate(UserStatus.ACTIVE)}
                            >
                                Active
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-red-500 rounded"
                                onClick={() => handleStatusUpdate(UserStatus.INACTIVE)}
                            >
                                Inactive
                            </button>
                        </div>
                        <button
                            className="px-4 py-2 mt-4 text-gray-600 bg-gray-200 rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Updating Info
            {isUpdateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
                    <div className="p-6 transition duration-300 ease-out transform bg-white rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold">Update Information</h2>
                        <div className="mt-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <input
                                type="email"
                                name="userEmail"
                                placeholder="Email"
                                value={formData.userEmail || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone number"
                                value={formData.phoneNumber || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <select
                                name="role"
                                value={formData.role || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                            >
                                <option value="" disabled>Select Role</option>
                                {Object.values(UserRole).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
                            onClick={handleUpdateInfo}
                        >
                            Update
                        </button>
                        <button
                            className="px-4 py-2 mt-4 text-gray-600 bg-gray-200 rounded"
                            onClick={() => setIsUpdateModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )} */}
        </>
    );
}

export default withAuthProtection(Profile);
