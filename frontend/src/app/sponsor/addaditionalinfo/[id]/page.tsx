"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';

const userRoles = ['Volunteer', 'Sponsor', 'Event_Manager'] as const;
type UserRole = typeof userRoles[number];

interface FormData {
    nickName: string;
    email: string;
    companyName: string;
    website: string;
    sponsorshipAmount: string;
    sponsorshipType: string;
    startDate: string;  // Keep as string for date input
    endDate: string;    // Keep as string for date input
    contractUrl: string;
}

interface FormErrors {
    [key: string]: string;
}

function AddUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const [formData, setFormData] = useState<FormData>({
        nickName: '',
        email: '',
        companyName: '',
        website: '',
        sponsorshipAmount: '',
        sponsorshipType: '',
        startDate: '',
        endDate: '',
        contractUrl: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        // Clear the error for this field when the user starts typing
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const validateForm = (): FormErrors => {
        let formErrors: FormErrors = {};
        if (!formData.nickName.trim()) {
            formErrors.nickName = 'Nickname is required';
        }
        if (!formData.email.trim()) {
            formErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            formErrors.email = 'Email must be a valid email address';
        }
        if (!formData.companyName.trim()) {
            formErrors.companyName = 'Company name is required';
        }
        if (!formData.website.trim()) {
            formErrors.website = 'Website is required';
        } else if (!/^https?:\/\/[^\s@]+\.[^\s@]+$/.test(formData.website)) {
            formErrors.website = 'Website must be a valid URL';
        }
        if (!formData.sponsorshipAmount.trim()) {
            formErrors.sponsorshipAmount = 'Sponsorship amount is required';
        } else if (!/^\d+$/.test(formData.sponsorshipAmount)) {
            formErrors.sponsorshipAmount = 'Sponsorship amount must be a positive integer';
        }
        if (!formData.sponsorshipType.trim()) {
            formErrors.sponsorshipType = 'Sponsorship type is required';
        }
        if (!formData.startDate.trim()) {
            formErrors.startDate = 'Start date is required';
        }
        if (!formData.endDate.trim()) {
            formErrors.endDate = 'End date is required';
        }
        if (!formData.contractUrl.trim()) {
            formErrors.contractUrl = 'Contract URL is required';
        } else if (!/^https?:\/\/[^\s@]+\.[^\s@]+$/.test(formData.contractUrl)) {
            formErrors.contractUrl = 'Contract URL must be a valid URL';
        }
        return formErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Create a new object with the correct data types
        const dataToSend = {
            ...formData,
            sponsorshipAmount: formData.sponsorshipAmount ? parseInt(formData.sponsorshipAmount, 10) : undefined,
            // Ensure dates are in ISO format
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        };

        try {
            await axios.put(`http://localhost:3000/sponsors/add-infov/${id}`, dataToSend);
            toast.success('Volunteer information updated successfully');
            router.push(`/emanager/deleteusers`);
        } catch (error) {
            console.error('Error updating user:', error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                if (axiosError.response?.data?.message) {
                    toast.error(`Error: ${axiosError.response.data.message}`);
                } else {
                    toast.error('Failed to update volunteer information. Please try again.');
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-white-700">
                    <h1 className="mb-4 text-2xl font-bold">Add Additional Information</h1>

                    {/* Red Warning Message */}
                    {/* <div className="p-4 mb-4 text-red-900 bg-red-100 border-l-4 border-red-600">
                        <p className="text-sm">
                            Warning: After adding a new user, please ensure that you provide additional information for the volunteer or sponsor in their respective profile sections.
                        </p>
                    </div> */}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(Object.keys(formData) as Array<keyof FormData>).map((key) => (
                            <div key={key} className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={key}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </label>
                                <input
                                    type={key === 'startDate' || key === 'endDate' ? 'date' : 'text'}
                                    id={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                />
                                {errors[key] && <p className="mt-1 text-xs italic text-red-500">{errors[key]}</p>}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            Add User
                        </button>
                    </form>
                </div>
            </div>

            <Toaster />
        </>
    );
}

export default withAuthProtection(AddUser);
