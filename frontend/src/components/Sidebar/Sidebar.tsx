"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ThemeToggler from '../Header/ThemeToggler';

interface User {
    id: string;
    name: string;
    username: string;
    userEmail: string;
    role: string;
    phoneNumber: string;
    isActive: boolean;
}

export default function Sidebar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    // const fetchData = async () => {
    //     try {
    //         const user_id = localStorage.getItem('user_id');
    //         if (user_id) {
    //             const response = await axios.get(`http://localhost:3000/user/byid/${user_id}`);
    //             setUser(response.data);
    //             // toast.success('Refresh Profile');
    //         } else {
    //             toast.error('User ID not found');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching profile:', error);
    //         toast.error('Error fetching profile');
    //     }
    // };

    const fetchData = async (user_id: string) => {
        if (!user_id) {
            router.push('/signin');
        }
        try {
            const response = await axios.get(`http://localhost:3000/user/byid/${user_id}`);
            setUser(response.data);
        } catch (error: any) {
            console.error('Error fetching profile:', error.response || error.message);
            toast.error(error.response?.data?.message || 'Error fetching profile');
        }
    };


    // // Fetch data when component mounts
    // useEffect(() => {
    //     fetchData();
    // }, []);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        if (user_id) {
            fetchData(user_id);
        } else {
            toast.error('User ID not found');
        }
    }, []);


    // const handleLogout = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });

    //         if (response.data.message === 'Logged out successfully') {
    //             // Clear the localStorage
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('user_id');

    //             // Show success message
    //             toast.success('Logged out successfully');

    //             // Redirect to the sign-in page
    //             router.push('/signin');
    //         } else {
    //             console.error('Logout failed:', response.data.message);
    //             toast.error('Logout failed');
    //         }
    //     } catch (error) {
    //         console.error('Error logging out:', error);
    //         toast.error('Error logging out');
    //     }
    // };

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user_id');
    //     router.push('/signin');
    // };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        toast.success('Logged out successfully');
        router.push('/signin');
    };



    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
                    {/* Welcome Message */}
                    <Link href="/emanager/profile">
                        <p className="flex items-center space-x-3 rtl:space-x-reverse">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Welcome, {user?.name || "Not Available"}
                            </span>
                        </p>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul className="flex flex-col mt-4 font-medium rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <Link href="/emanager/dashboard" aria-label="Dashboard">
                                    <p className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Dashboard
                                    </p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/emanager/userdetails">
                                    <p className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        User Information
                                    </p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/emanager/profile">
                                    <p className="block px-3 py-2 text-gray-900 rounded md:p-0 hover:bg-gray-100 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        User Profile
                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ThemeToggler Component */}
                    <div className="flex items-center">
                        <ThemeToggler />
                    </div>
                </div>
            </nav>

            <br /><br />
            <br />

            {/* Sidebar */}
            <div className='mt-3'>
                <aside className="fixed left-0 w-64 h-full transition-transform -translate-x-full sm:translate-x-0 bg-gray-50 dark:bg-gray-800">
                    <div className="h-full px-3 py-4 overflow-y-auto">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link href="/emanager/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ms-3">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/emanager/userdetails" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    {/* <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>

                                    <span className="flex-1 ms-3 whitespace-nowrap">User Information</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/emanager/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">User Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/emanager/updateprofile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                    <span className="flex-1 ms-3 whitespace-nowrap">Update Profile</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/showallevent" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>

                                    <span className="flex-1 ms-3 whitespace-nowrap">Event manage</span>

                                </Link>

                            </li>
                            {/* <li>
                                <a className="flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleLogout}>
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                                </a>
                            </li> */}
                            {/* <li>
                            <a className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" onClick={handleLogout}>
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                            </a>
                            </li> */}
                            <li>
                                <a
                                    className="flex items-center p-2 text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group " // Add cursor-pointer here
                                    onClick={handleLogout}
                                >
                                    {/* <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 18 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                                        />
                                    </svg> */}

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                    </svg>

                                    <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
                                </a>
                            </li>

                        </ul>
                    </div>
                </aside>
            </div>

        </>
    );
}


// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import Link from 'next/link';
// import toast from 'react-hot-toast';
// import ThemeToggler from '../Header/ThemeToggler';

// interface User {
//     id: string;
//     name: string;
//     username: string;
//     userEmail: string;
//     role: string;
//     phoneNumber: string;
//     isActive: boolean;
// }

// export default function Sidebar() {
//     const router = useRouter();
//     const [user, setUser] = useState<User | null>(null);

//     const fetchData = async (user_id: string) => {
//         if (!user_id) {
//             router.push('/signin');
//             return;
//         }
//         try {
//             const response = await axios.get(`http://localhost:3000/user/byid/${user_id}`);
//             setUser(response.data);
//         } catch (error: any) {
//             console.error('Error fetching profile:', error.response || error.message);
//             toast.error(error.response?.data?.message || 'Error fetching profile');
//         }
//     };

//     useEffect(() => {
//         const user_id = localStorage.getItem('user_id');
//         if (user_id) {
//             fetchData(user_id);
//         } else {
//             toast.error('User ID not found');
//         }
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user_id');
//         toast.success('Logged out successfully');
//         router.push('/signin');
//     };

//     return (
//         <>
//             {/* Modern Navbar */}
//             <nav className="fixed top-0 z-50 w-full shadow-lg bg-gradient-to-r from-indigo-500 to-blue-600">
//                 <div className="flex items-center justify-between max-w-screen-xl p-4 mx-auto">
//                     {/* Welcome Message */}
//                     <Link href="/emanager/profile">
//                         <p className="flex items-center space-x-3 text-2xl font-semibold text-white">
//                             Welcome, {user?.name || "User"}
//                         </p>
//                     </Link>

//                     {/* Navigation Links */}
//                     <div className="hidden w-full md:block md:w-auto">
//                         <ul className="flex flex-col mt-4 font-medium rounded-lg md:flex-row md:space-x-8 md:mt-0">
//                             <li>
//                                 <Link href="/emanager/dashboard">
//                                     <p className="px-3 py-2 text-white transition duration-300 rounded hover:bg-white hover:text-indigo-600">
//                                         Dashboard
//                                     </p>
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/emanager/userdetails">
//                                     <p className="px-3 py-2 text-white transition duration-300 rounded hover:bg-white hover:text-indigo-600">
//                                         User Information
//                                     </p>
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/emanager/profile">
//                                     <p className="px-3 py-2 text-white transition duration-300 rounded hover:bg-white hover:text-indigo-600">
//                                         User Profile
//                                     </p>
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Theme Toggler */}
//                     <div className="flex items-center">
//                         <ThemeToggler />
//                     </div>
//                 </div>
//             </nav>

//             {/* Spacer to avoid overlap with fixed navbar */}
//             <div className="h-16"></div>

//             {/* Modern Sidebar */}
//             <aside className="fixed left-0 w-64 h-full bg-white shadow-xl dark:bg-gray-900">
//                 <div className="p-4">
//                     <ul className="space-y-4">
//                         <li>
//                             <Link href="/emanager/dashboard">
//                                 <div className="flex items-center p-2 text-gray-800 transition rounded-lg hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800">
//                                     <svg className="w-6 h-6 text-indigo-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
//                                         <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
//                                         <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
//                                     </svg>
//                                     <span className="ml-3">Dashboard</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/emanager/userdetails">
//                                 <div className="flex items-center p-2 text-gray-800 transition rounded-lg hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800">
//                                     <svg className="w-6 h-6 text-indigo-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
//                                         <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                                     </svg>
//                                     <span className="ml-3">User Information</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/emanager/profile">
//                                 <div className="flex items-center p-2 text-gray-800 transition rounded-lg hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-indigo-600 dark:text-white">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                                     </svg>
//                                     <span className="ml-3">User Profile</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/emanager/updateprofile">
//                                 <div className="flex items-center p-2 text-gray-800 transition rounded-lg hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-indigo-600 dark:text-white">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1 0 1.414l-1.687 1.688M6 12h4m-4 4h4m-4 4h4M3 3l18 18" />
//                                     </svg>
//                                     <span className="ml-3">Update Profile</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li>
//                             <button onClick={handleLogout} className="flex items-center p-2 text-gray-800 transition rounded-lg hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-indigo-600 dark:text-white">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H3m0 0l4.25 4.25M3 12l4.25-4.25" />
//                                 </svg>
//                                 <span className="ml-3">Logout</span>
//                             </button>
//                         </li>
//                     </ul>
//                 </div>
//             </aside>
//         </>
//     );
// }
