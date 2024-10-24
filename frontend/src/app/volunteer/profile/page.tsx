"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';

interface User {
    id: number;
    username: string;
    userEmail: string;
    role: string;
    phoneNumber: string;
    isActive: boolean;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    const fetchData = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            if (user_id) {
                const response = await axios.get(`http://localhost:3000/user/byid/${user_id}`);
                setUser(response.data);
                // toast.success('Refresh Profile');
            } else {
                toast.error('User ID not found');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Error fetching profile');
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission
        fetchData();  // Fetch data when the form is submitted
        toast.success('Refresh Profile');
    };
    
    return (
        <>
            
            <Sidebar/>
            <Toaster position="bottom-right" />
            
            <form onSubmit={handleSubmit}>
                <div className="p-4 my-8 sm:ml-64">
                    <div className="p-4 my-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        <div className="relative flex items-center justify-center p-5 overflow-hidden transition-all duration-500 transform bg-gray-100 shadow-xl dark:bg-gray-800 hover:shadow-2xl group rounded-xl">
                            <div className="flex items-center gap-4">
                                {user && (
                                    <img src={`http://localhost:4000/student/getProfilePicture/${user.id}`}
                                        className="object-cover object-center w-32 h-32 transition-all duration-500 delay-500 transform rounded-full group-hover:w-36 group-hover:h-36"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white border rounded-lg shadow">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    My Profile
                                </h3>
                            </div>
                            <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Id</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.id}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">User name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.username}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">User email</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.userEmail}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.phoneNumber}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Role</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.role}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Active</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user?.isActive ? "Yes" : "No"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="p-2 text-white bg-blue-500 rounded">
                        Refresh Profile
                    </button>
                </div>
            </form>
        </>
    );
}
