
"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';

const userStatus = ['Pending', 'In Progress', 'Completed', 'Cancelled'] as const;
type UserStatus = typeof userStatus[number];

interface FormData {
  name: string;
  description: string;
  date: string;
  status: UserStatus | '';
}

interface FormErrors {
  [key: string]: string;
}

function AddEvent() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    date: '',
    status: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [eventManagerId, setEventManagerId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          const response = await axios.get(`http://localhost:3000/event-managers/user/${userId}`);
          setEventManagerId(response.data.id);
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
      }
    };

    fetchProfileData();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear the error for this field when the user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = (): FormErrors => {
    let formErrors: FormErrors = {};
  
    // Validate Name (required, at least 3 characters)
    if (!formData.name) {
      formErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      formErrors.name = 'Name must be at least 3 characters';
    }
  
    // Validate Description (required, at least 10 characters)
    if (!formData.description) {
      formErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      formErrors.description = 'Description must be at least 10 characters';
    }
  
    // Validate Date (required, must be a valid date)
    if (!formData.date) {
      formErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        formErrors.date = 'Date must be in the future';
      }
    }
  
    // Validate Status (required, must be one of the defined statuses)
    if (!formData.status) {
      formErrors.status = 'Status is required';
    } else if (!userStatus.includes(formData.status as UserStatus)) {
      formErrors.status = 'Invalid status selected';
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
      if (eventManagerId) {
        const response = await axios.post(`http://localhost:3000/events/em/${eventManagerId}`, formData);
        toast.success('Event added successfully!');
        router.push('/events'); // Redirect the user to the events list page
      } else {
        toast.error('Error: Event Manager ID not found.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        toast.error('An error occurred while adding the event.');
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64">
        {eventManagerId !== null ? (
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-white-700">
            <h1 className="mb-4 text-2xl font-bold">Add New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(Object.keys(formData) as Array<keyof FormData>).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block mb-2 text-sm font-bold text-white-700" htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {key === 'status' ? (
                    <select
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm leading-tight border rounded shadow appearance-none text-white-700 focus:outline-none focus:shadow-outline"
                    >
                      <option value="">Select Status</option>
                      {userStatus.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={key === 'date' ? 'date' : 'text'}
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={`Enter ${key}`}
                      className="w-full px-3 py-2 text-sm leading-tight border rounded shadow appearance-none text-white-700 focus:outline-none focus:shadow-outline"
                    />
                  )}
                  {errors[key] && <p className="mt-1 text-xs italic text-red-500">{errors[key]}</p>}
                </div>
              ))}
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Add Event
              </button>
            </form>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <Toaster />
    </>
  );
}

export default withAuthProtection(AddEvent);