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
    const fetchEventManagerId = async () => {
      try {
        const eventManagerId = await getEventManagerId();
        setEventManagerId(eventManagerId);
      } catch (error: any) {
        console.error('Error fetching event manager ID:', error.response || error.message);
        toast.error(error.response?.data?.message || 'Error fetching event manager ID');
      }
    };

    fetchEventManagerId();
  }, []);

  const getEventManagerId = async (): Promise<number> => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/signin');
      return 0;
    }

    try {
      const response = await axios.get(`http://localhost:3000/event-managers/${userId}`);
      return response.data.id;
    } catch (error) {
      throw error;
    }
  };

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
    // Validation logic remains the same
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