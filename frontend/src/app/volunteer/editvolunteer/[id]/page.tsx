'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';

interface User {
    id: string;
    nickName: string;
    email: string;
    experience: string;
    skills: string;
}

function EditUserPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [user, setUser] = useState<User>({
        id: '',
        nickName: '',
        email: '',
        experience: '',
        skills: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:3000/volunteers/${id}`);
                    setUser(response.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    toast.error('Failed to fetch user information');
                }
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Extract only the fields that should be updated
        const { nickName, email, experience, skills } = user;
        const updatedUser = { nickName, email, experience, skills };

        try {
            await axios.put(`http://localhost:3000/volunteers/volunteer/${id}`, updatedUser);
            toast.success('Volunteer additional information updated successfully');
            router.push("/emanager/editAllUsers");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    toast.error("Email is already taken");
                } else {
                    console.error("Axios error:", error.response?.data || error.message);
                    toast.error(`Failed to update user: ${error.response?.data?.message || error.message}`);
                }
            } else {
                console.error("Error updating user:", error);
                toast.error("Failed to update user: Unknown error");
            }
        }
    };


    return (
        <>
            <Toaster position="bottom-right" />
            <Sidebar />
            <div className="p-4 my-8 sm:ml-64">
                <div className="p-4 my-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <form onSubmit={handleUpdate}>
                        <div className="overflow-hidden bg-white border rounded-lg shadow-lg">
                            <div className="px-6 py-5 sm:px-6">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    Edit User
                                </h3>
                            </div>
                            <div className="px-6 py-5 border-t border-gray-200 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    {/* nickname Input */}
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Nick Name</dt>
                                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                                            <input
                                                type="text"
                                                name="nickName"
                                                value={user.nickName}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter user's nickname"
                                            />
                                        </dd>
                                    </div>

                                    {/* email Input */}
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                                            <input
                                                type="email"
                                                name="email"
                                                value={user.email}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter user's email"
                                            />
                                        </dd>
                                    </div>

                                    {/* experience Input */}
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                                            <input
                                                type="text"
                                                name="experience"
                                                value={user.experience}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter user's experience"
                                            />
                                        </dd>
                                    </div>

                                    {/* skills Input */}
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                        Skills
                                        </dt>
                                        <dd className="mt-1 text-sm text-white-900 sm:mt-0 sm:col-span-2">
                                            <input
                                                type="text"
                                                name="skills"
                                                value={user.skills}
                                                onChange={handleChange}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Enter user's skills"
                                            />
                                        </dd>
                                    </div>
                                   
                                </dl>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-6">
                            <button
                                type="submit"
                                className="inline-flex items-center px-5 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default withAuthProtection (EditUserPage);