"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon, Edit2Icon, TrashIcon } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';  // Import toast from react-hot-toast
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function EDashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/allUsers", {
          params: {
            sortBy: sortConfig.key,
            sortOrder: sortConfig.direction.toUpperCase(),
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredData = data.filter((user) =>
    user.id.toString().includes(searchTerm) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (userId) => {
    router.push(`/emanager/updateusers/${userId}`);
  };

  // const handleDelete = async (userId) => {
  //   // Show a warning message via toast
  //   toast.error('Please delete the specific user first from their table, then proceed here.');

  //   if (window.confirm('Delete this user?')) {
  //     try {
  //       // Use a regular toast with a custom message to guide the user
  //       toast('Now proceed to delete the user from this table.', {
  //         duration: 4000,
  //         style: {
  //           background: '#ffd700',  // You can set the background to a custom color like gold/yellow for "info"-like messages
  //           color: '#000',
  //         },
  //       });

  //       await axios.delete(`http://localhost:3000/user/${userId}`);
  //       setData(data.filter((user) => user.id !== userId));

  //       // Success notification
  //       toast.success('User deleted successfully.');
  //     } catch (error) {
  //       console.error("Error deleting user:", error);

  //       // Show an error message
  //       toast.error('Failed to delete user. Please try again.');
  //     }
  //   }
  // };


  return (
    <>
      <Sidebar />
      <div className="p-1 my-6 sm:ml-64">
        <div className="flex flex-col min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-6xl px-3 py-1 mx-auto sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-center text-gray-900">All Users</h1>
            </div>
          </header>
          <main className="container flex-grow px-4 py-6 mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="flex justify-end p-3 space-x-4">
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => router.push('/emanager/adduser')}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add User
                </button>

                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-blue-700"
                  onClick={() => router.push('/emanager/editAllUsers')}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit User
                </button>
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                  onClick={() => router.push('/emanager/deleteusers')}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />

                  Delete User
                </button>
              </div>

              <div className="p-1">
                <input
                  type="text"
                  placeholder="Search by ID, name, username, or email..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["id", "name", "username", "userEmail", "phoneNumber", "role", "actions"].map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                          onClick={() => column !== 'actions' && handleSort(column)}
                        >
                          {column.charAt(0).toUpperCase() + column.slice(1)}
                          {sortConfig.key === column && column !== 'actions' && (
                            sortConfig.direction === 'asc'
                              ? <ChevronUpIcon className="inline w-3 h-3 ml-1" />
                              : <ChevronDownIcon className="inline w-3 h-3 ml-1" />
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    
                    {filteredData.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{user.id}</td>
                        <td className="px-4 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{user.username}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{user.userEmail}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{user.phoneNumber}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{user.role}</td>
                        <td className="px-4 py-2 text-xs font-medium whitespace-nowrap">
                          <div className="flex items-center justify-center h-full">
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2Icon className="items-center justify-center w-4 h-4" />
                            </button>
                            {/* <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button> */}
                          </div>
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default withAuthProtection(EDashboard);
