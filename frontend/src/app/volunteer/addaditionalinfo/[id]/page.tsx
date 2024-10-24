"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';

interface FormData {
    nickName: string;
    email: string;
    experience: string;
    skills: string;
}

interface FormErrors {
    [key: string]: string;
}

function AddUser({ params }: { params: { id: string } }) {
    const { id } = params;
    const [formData, setFormData] = useState<FormData>({
        nickName: '',
        email: '',
        experience: '',
        skills: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        
        if (!formData.experience.trim()) {
            formErrors.experience = 'Experience is required';
        }
        
        if (!formData.skills.trim()) {
            formErrors.skills = 'Skills are required';
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

        try {
            await axios.put(`http://localhost:3000/volunteers/add-infov/${id}`, formData);
            toast.success('User information updated successfully');
            router.push(`/emanager/users`);
        } catch (error) {
            console.error('Error updating user:', error);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<{ message: string }>;
                if (axiosError.response?.data?.message) {
                    toast.error(`Error: ${axiosError.response.data.message}`);
                } else {
                    toast.error('Failed to update user information. Please try again.');
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
                    <h1 className="mb-4 text-2xl font-bold">Update User Information</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {(Object.keys(formData) as Array<keyof FormData>).map((key) => (
                            <div key={key} className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor={key}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </label>
                                {key === 'experience' || key === 'skills' ? (
                                    <textarea
                                        id={key}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                        rows={4}
                                    />
                                ) : (
                                    <input
                                        type={key === 'email' ? 'email' : 'text'}
                                        id={key}
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                        className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    />
                                )}
                                {errors[key] && <p className="mt-1 text-xs italic text-red-500">{errors[key]}</p>}
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        >
                            Update User
                        </button>
                    </form>
                </div>
            </div>

            <Toaster />
        </>
    );
}

export default withAuthProtection(AddUser);