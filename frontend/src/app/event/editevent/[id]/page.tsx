'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { CalendarDays, FileText, Type, Activity, Save, ArrowLeft } from 'lucide-react';

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    status: string;
}

interface EventResponse {
    event: Event;
}

function EditEvent({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState<Event>({
        id: '',
        name: '',
        description: '',
        date: '',
        status: '',
    });

    const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

    useEffect(() => {
        const fetchEvent = async () => {
            if (id) {
                try {
                    const response = await axios.get<EventResponse>(`http://localhost:3000/events/${id}`);
                    setEvent(response.data.event); // Access the event property from the response
                } catch (error) {
                    console.error('Error fetching event:', error);
                    toast.error('Failed to fetch event information');
                }
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { name, description, date, status } = event;
        const updatedEvent = { name, description, date, status };

        try {
            await axios.put(`http://localhost:3000/events/${id}`, updatedEvent);
            toast.success('Event updated successfully');
            router.push("/event/showallevent");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    toast.error("Event name is already taken");
                } else {
                    toast.error(`Failed to update event: ${error.response?.data?.message || error.message}`);
                }
            } else {
                toast.error("Failed to update event: Unknown error");
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
                            <h1 className="mt-4 text-3xl font-bold text-white-900">Edit Event</h1>
                            <p className="mt-2 text-sm text-white-600">
                                Update the event details below
                            </p>
                        </div>

                        {/* Form */}
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                            <form onSubmit={handleUpdate} className="divide-y divide-gray-200">
                                {/* Name Field */}
                                <div className="p-6 space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Type className="w-4 h-4 mr-2 text-gray-400" />
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={event.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-gray-200 rounded-lg text-white-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter event name"
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="p-6 space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={event.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border-gray-200 rounded-lg text-white-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter event description"
                                    />
                                </div>

                                {/* Date Field */}
                                <div className="p-6 space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={event.date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-gray-200 rounded-lg text-white-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Status Field */}
                                <div className="p-6 space-y-1">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Activity className="w-4 h-4 mr-2 text-gray-400" />
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={event.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border-gray-200 rounded-lg text-white-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select status</option>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="px-6 py-4 bg-gray-50">
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isLoading ? 'Updating...' : 'Update Event'}
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

export default withAuthProtection(EditEvent);