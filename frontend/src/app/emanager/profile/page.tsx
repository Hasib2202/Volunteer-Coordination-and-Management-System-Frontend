"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';

interface EventManager {
    id: number;
    position: string | null;
    organization: string | null;
    bio: string | null;
    specialization: string | null;
    yearsOfExperience: number | null;
    profilePicture: string | null;
}

function EventManagerProfile() {
    const [eventManager, setEventManager] = useState<EventManager | null>(null);
    const [loading, setLoading] = useState(true); // Track loading state

    const fetchProfileData = async () => {
        try {
            const userId = localStorage.getItem('user_id'); // Assuming you store the user ID in localStorage
            if (userId) {
                const response = await axios.get(`http://localhost:3000/event-managers/user/${userId}`);
                setEventManager(response.data);
            } else {
                toast.error('User ID not found');
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            if (axios.isAxiosError(error)) {
                toast.error(`Error: ${error.response?.data.message || error.message}`);
            } else {
                toast.error('Unexpected error occurred');
            }
        } finally {
            setLoading(false); // Set loading to false once the request is complete
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchProfileData();
    }, []);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission
        fetchProfileData();  // Refresh the profile data
        toast.success('Profile refreshed successfully');
    };

    return (
        <>
            <Sidebar />
            <Toaster position="bottom-right" />
            
            <form onSubmit={handleSubmit}>
                <div className="p-4 my-8 sm:ml-64">
                    <div className="p-4 my-8 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                        {loading ? ( // Show loading state
                            <div className="flex justify-center">Loading...</div>
                        ) : (
                            <div className="relative flex items-center justify-center p-5 overflow-hidden transition-all duration-500 transform bg-gray-100 shadow-xl dark:bg-gray-800 hover:shadow-2xl group rounded-xl">
                                <div className="flex items-center gap-4">
                                    {eventManager && (
                                        <img
                                        src={`http://localhost:3000/uploads/profile-pictures/${eventManager.profilePicture}`} // Correct path to the profile picture
                                        alt="Profile Picturee"
                                        className="object-cover object-center w-32 h-32 transition-all duration-500 delay-500 transform rounded-full group-hover:w-36 group-hover:h-36"
                                    />
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="overflow-hidden bg-white border rounded-lg shadow">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Event Manager Profile
                                </h3>
                            </div>
                            <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.id}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.position}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Organization</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.organization}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Bio</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.bio}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.specialization}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Years of Experience</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {eventManager?.yearsOfExperience}
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

export default withAuthProtection(EventManagerProfile);