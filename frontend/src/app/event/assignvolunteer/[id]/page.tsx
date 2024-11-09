'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

function AssignVolunteer({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id: eventId } = params;
    const [volunteerId, setVolunteerId] = useState<number | ''>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!volunteerId) {
            toast.error('Please enter a volunteer ID');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Assigning Volunteer...');

        try {
            await axios.post(`http://localhost:3000/events/assign-volunteer/${eventId}`, { volunteerId });
            toast.success('Volunteer assigned successfully', { id: loadingToast });
            router.push('/event/showallevent');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(`Failed to assign volunteer: ${error.response?.data?.message || error.message}`, { id: loadingToast });
            } else {
                toast.error("Failed to assign volunteer: Unknown error", { id: loadingToast });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="min-h-screen py-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <button
                                onClick={() => router.push('/event/showallevent')}
                                className="flex items-center text-sm text-gray-600 transition-colors hover:text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Events
                            </button>
                            <h1 className="mt-4 text-3xl font-bold text-white-900">Assign Volunteer</h1>
                            <p className="mt-2 text-sm text-white-600">
                                Assign a volunteer to this event by entering their ID below.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                                {/* Volunteer ID Field */}
                                <div className="p-6 space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <UserPlus className="w-4 h-4 mr-2 text-gray-400" />
                                        Volunteer ID
                                    </label>
                                    <input
                                        type="number"
                                        name="volunteerId"
                                        value={volunteerId}
                                        onChange={(e) => setVolunteerId(Number(e.target.value))}
                                        className="w-full px-4 py-2 border-gray-200 rounded-lg text-white-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter volunteer ID"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="px-6 py-4 bg-gray-50">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading || volunteerId === ''}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? 'Assigning...' : 'Assign Volunteer'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AssignVolunteer;
