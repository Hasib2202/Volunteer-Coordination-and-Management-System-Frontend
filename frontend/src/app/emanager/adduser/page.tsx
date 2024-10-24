"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { AlertTriangle } from 'lucide-react';

const userRoles = ['Volunteer', 'Sponsor', 'Event_Manager'] as const;
type UserRole = typeof userRoles[number];

interface FormData {
  name: string;
  username: string;
  userEmail: string;
  password: string;
  role: UserRole | '';
  phoneNumber: string;
}

interface FormErrors {
  [key: string]: string;
}

function AddUser() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    userEmail: '',
    password: '',
    role: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

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
    if (!formData.name.trim()) {
      formErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      formErrors.name = 'Name should contain only alphabets and spaces';
    }
    if (!formData.username.trim()) {
      formErrors.username = 'Username is required';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(formData.username)) {
      formErrors.username = 'Username must contain letters, numbers, and special characters';
    }
    if (!formData.userEmail.trim()) {
      formErrors.userEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      formErrors.userEmail = 'Email must be a valid email address';
    }
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.role) {
      formErrors.role = 'Role is required';
    } else if (!userRoles.includes(formData.role as UserRole)) {
      formErrors.role = 'Role must be either Volunteer or Sponsor';
    }
    if (!formData.phoneNumber.trim()) {
      formErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must be 11 digits';
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
      const response = await axios.post('http://localhost:3000/auth/register', formData);
      toast.success('User added successfully');

      const { role, id } = response.data;  // Assuming the response contains user id and role

      // Redirect based on the role
      if (role === 'Event_Manager') {
        router.push(`/emanager/allemanagers`);
      } else if (role === 'Volunteer') {
        router.push(`/volunteer/allvolunteers`);
      } else if (role === 'Sponsor') {
        router.push(`/sponsor/allsponsors`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 409) {
          // 409 Conflict status usually indicates a duplicate resource
          setErrors(prevErrors => ({
            ...prevErrors,
            username: 'Username is already taken. Please try a different username.'
          }));
          toast.error('Username is already taken. Please try a different username.');
        } else {
          toast.error('Failed to add user. Please try again.');
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
          <h1 className="mb-4 text-2xl font-bold">Add New Volunteer or Sponsor</h1>

          {/* Red Warning Message */}
          <div className="p-4 mb-4 text-red-900 bg-red-100 border-l-4 border-red-600">
            <p className="text-sm">
              Warning: After adding a new user, please ensure that you provide additional information for the volunteer or sponsor in their respective profile sections.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(Object.keys(formData) as Array<keyof FormData>).map((key) => (
              <div key={key} className="mb-4">
                <label className="block mb-2 text-sm font-bold text-white-700" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {key === 'role' ? (
                  <select
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm leading-tight border rounded shadow appearance-none text-white-700 focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Role</option>
                    {userRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key === 'password' ? 'password' : 'text'}
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