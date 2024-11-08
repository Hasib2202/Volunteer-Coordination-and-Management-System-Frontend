"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function AllEvents() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ASC" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/events/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            sortBy: sortConfig.key,
            sortOrder: sortConfig.direction,
          },
        });
        
        setData(response.data.events || []);
        
        if (!response.data.events) {
          console.warn("No events array in response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching events data:", error.response || error);
        toast.error(error.response?.data?.message || "Failed to fetch events data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ASC" ? "DESC" : "ASC",
    }));
  };

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    return data.filter((event) => {
      if (!event) return false;
      const searchLower = searchTerm.toLowerCase();
      
      return (
        event.id?.toString().includes(searchTerm) ||
        event.name?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.date?.toLowerCase().includes(searchLower) || 
        event.status?.toLowerCase().includes(searchLower) ||
        event.progressNote?.toLowerCase().includes(searchLower) || 
        event.eventManager?.name?.toLowerCase().includes(searchLower) ||
        event.eventManager?.id?.toString().includes(searchTerm) ||
        (event.progress && JSON.stringify(event.progress).toLowerCase().includes(searchLower)) ||
        event.totalVolunteers?.toString().includes(searchTerm) ||
        event.totalDocuments?.toString().includes(searchTerm)
      );
    });
  }, [data, searchTerm]);

  const handleEdit = (eventId) => {
    router.push(`/emanager/updateusers/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData((prevData) => prevData.filter(event => event.id !== eventId));
        toast.success("Event deleted successfully.");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error(error.response?.data?.message || "Failed to delete event.");
      }
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const formatProgress = (progress) => {
    if (!progress) return 'N/A';
    try {
      return typeof progress === 'object' ? 
        `${progress.overall}%` : 
        progress.toString();
    } catch (error) {
      return 'N/A';
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'progressNote', label: 'Progress Note' },
    { key: 'progress', label: 'Progress' },
    { key: 'totalVolunteers', label: 'Volunteers' },
    { key: 'totalDocuments', label: 'Documents' },
    { key: 'eventManager', label: 'Event Manager' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <>
      <Sidebar />
      <div className="p-1 my-6 sm:ml-64">
        <div className="flex flex-col min-h-screen bg-gray-100">
          <header className="bg-white shadow">
            <div className="max-w-6xl px-3 py-1 mx-auto sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-center text-gray-900">All Events</h1>
            </div>
          </header>
          
          <main className="container flex-grow px-4 py-6 mx-auto sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="flex justify-end p-3 space-x-4">
                <button
                  className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => router.push('/event/addevent')}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Event
                </button>

                <button
                  className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-blue-700"
                  onClick={() => router.push('/emanager/editAllUsers')}
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit Event
                </button>
                <button
                  className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                  onClick={() => router.push('/emanager/deleteusers')}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete Event
                </button>
              </div>
              <div className="p-1">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No events found
                  </div>
                ) : (
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
                            <div className="flex items-center">
                              {column.label}
                              {sortConfig.key === column.key && (
                                sortConfig.direction === 'ASC'
                                  ? <ChevronUpIcon className="w-4 h-4 ml-1" />
                                  : <ChevronDownIcon className="w-4 h-4 ml-1" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((event, index) => (
                        <tr key={event.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.id}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.name}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.description}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{formatDate(event.date)}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.status}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.progressNote}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{formatProgress(event.progress)}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.totalVolunteers}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.totalDocuments}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">{event.eventManager?.name}</td>
                          <td className="px-4 py-2 text-xs text-gray-500">
                            <div className="flex space-x-4">
                              <button onClick={() => handleEdit(event.id)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button onClick={() => handleDelete(event.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default withAuthProtection(AllEvents);
