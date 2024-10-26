"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon, Edit2Icon, TrashIcon, SearchIcon, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

function EditAllUsers() {
    const [activeTable, setActiveTable] = useState('allUsers');
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const tableConfig = {
        allUsers: {
            endpoint: "http://localhost:3000/user/allUsers",
            deleteEndpoint: "http://localhost:3000/user/delete/",
            columns: [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'username', label: 'Username' },
                { key: 'userEmail', label: 'Email' },
                { key: 'role', label: 'Role' },
                { key: 'phoneNumber', label: 'Phone Number' },
            ],
            warningMessage: "Please delete the user from their specific role table (Event Manager, Volunteer, or Sponsor) before deleting from the All Users table."
        },
        eventManagers: {
            endpoint: "http://localhost:3000/event-managers/all",
            deleteEndpoint: "http://localhost:3000/event-managers/",
            columns: [
                { key: 'id', label: 'EM ID' },
                { key: 'userId', label: 'User ID' },
                { key: 'nickName', label: 'Nickname' },
                { key: 'email', label: 'Email' },
                { key: 'position', label: 'Position' },
                { key: 'organization', label: 'Organization' },
                { key: 'bio', label: 'Bio' },
                { key: 'specialization', label: 'Specialization' },
                { key: 'yearsOfExperience', label: 'Years of Experience' },
            ],
            warningMessage: "After deleting from this table, remember to delete the user from the All Users table as well."
        },
        volunteers: {
            endpoint: "http://localhost:3000/volunteers/all",
            deleteEndpoint: "http://localhost:3000/volunteers/",
            columns: [
                { key: 'id', label: 'V ID' },
                { key: 'userId', label: 'User ID' },
                { key: 'nickName', label: 'Nickname' },
                { key: 'email', label: 'Email' },
                { key: 'experience', label: 'Experience' },
                { key: 'skills', label: 'Skills' },
            ],
            warningMessage: "After deleting from this table, remember to delete the user from the All Users table as well."
        },
        sponsors: {
            endpoint: "http://localhost:3000/sponsors/all",
            deleteEndpoint: "http://localhost:3000/sponsors/",
            columns: [
                { key: 'id', label: 'S ID' },
                { key: 'userId', label: 'User ID' },
                { key: 'nickName', label: 'Nickname' },
                { key: 'email', label: 'Email' },
                { key: 'companyName', label: 'Company Name' },
                { key: 'website', label: 'Website' },
                { key: 'sponsorshipAmount', label: 'Sponsorship Amount' },
                { key: 'sponsorshipType', label: 'Sponsorship Type' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
                { key: 'contractUrl', label: 'Contract URL' },
            ],
            warningMessage: "After deleting from this table, remember to delete the user from the All Users table as well."
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTable, sortConfig]);

    useEffect(() => {
        filterData();
    }, [data, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await axios.get(tableConfig[activeTable].endpoint, {
                params: {
                    sortBy: sortConfig.key,
                    sortOrder: sortConfig.direction.toUpperCase(),
                },
            });
            setData(response.data);
        } catch (error) {
            console.error(`Error fetching ${activeTable} data:`, error);
            toast.error(`Failed to fetch ${activeTable} data. Please try again.`);
        }
    };

    const filterData = () => {
        if (searchTerm === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                Object.values(item).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleEdit = (id) => {
        let route;
        switch (activeTable) {
            case 'allUsers':
                route = `/emanager/updateusers/${id}`;
                break;
            case 'eventManagers':
                route = `/emanager/editemanager/${id}`;
                break;
            case 'volunteers':
                route = `/volunteer/editvolunteer/${id}`;
                break;
            case 'sponsors':
                route = `/sponsor/editsponsor/${id}`;
                break;
            default:
                route = '/emanager';
        }
        router.push(route);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${activeTable.slice(0, -1)}?`)) {
            setIsDeleting(true);
            const loadingToast = toast.loading('Deleting...', { duration: 4000 });

            try {
                const endpoint = `${tableConfig[activeTable].deleteEndpoint}${id}`;
                await axios.delete(endpoint);

                // Wait for 4 seconds
                await new Promise(resolve => setTimeout(resolve, 4000));

                toast.dismiss(loadingToast);
                setData(data.filter((item) => item.id !== id));
                toast.success(`${activeTable.slice(0, -1)} deleted successfully.`);
                // router.push('/emanager/deleteusers');
            } catch (error) {
                console.error(`Error deleting ${activeTable.slice(0, -1)}:`, error);
                toast.dismiss(loadingToast);
                toast.error(`Failed to delete ${activeTable.slice(0, -1)}. Please try again.`);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const renderTable = () => {
        const columns = [...tableConfig[activeTable].columns, { key: 'actions', label: 'Actions' }];

        return (
            <>
                {/* <div className="p-4 mb-4 ml-4 mr-4 text-sm text-black bg-red-100 rounded-lg" role="alert">
                    <AlertTriangle className="inline-block w-5 h-5 mr-2" />
                    <span className="font-medium text-red-800">Warning:</span> {tableConfig[activeTable].warningMessage}
                </div> */}


                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                                    onClick={() => column.key !== 'actions' && handleSort(column.key)}
                                >
                                    {column.label}
                                    {sortConfig.key === column.key && column.key !== 'actions' && (
                                        sortConfig.direction === 'asc'
                                            ? <ChevronUpIcon className="inline w-3 h-3 ml-1" />
                                            : <ChevronDownIcon className="inline w-3 h-3 ml-1" />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {columns.map((column) => (
                                    <td key={column.key} className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                                        {column.key === 'actions' ? (
                                            <div className="flex items-center justify-center space-x-2 ">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    disabled={isDeleting}
                                                >
                                                    <Edit2Icon className="w-4 h-4" />
                                                </button>
                                                {/* <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 "
                                                    disabled={isDeleting}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button> */}
                                            </div>
                                        ) : (
                                            item[column.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 my-8 sm:ml-64">
                <div className="flex flex-col min-h-screen bg-gray-100">
                    <header className="bg-white shadow">
                        <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
                            <h1 className="text-2xl font-bold text-center text-gray-900">Edit Users</h1>
                        </div>
                    </header>
                    <main className="container flex-grow px-4 py-6 mx-auto sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white rounded-lg shadow-md">
                            <div className="flex justify-center p-3 space-x-4">
                                {Object.keys(tableConfig).map((table) => (
                                    <button
                                        key={table}
                                        className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTable === table ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                        onClick={() => {
                                            setActiveTable(table);
                                            setSearchTerm('');
                                        }}
                                        disabled={isDeleting}
                                    >
                                        {table.charAt(0).toUpperCase() + table.slice(1)}
                                    </button>
                                ))}
                                {/* Back button */}
                                <button
                                    className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:bg-blue-600"
                                    onClick={() => router.push('/emanager/dashboard')}
                                    disabled={isDeleting}
                                >
                                    Back
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTable}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isDeleting}
                                    />
                                    <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                {renderTable()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Toaster />
        </>
    );
}

export default withAuthProtection(EditAllUsers);