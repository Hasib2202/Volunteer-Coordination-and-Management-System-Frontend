"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ChevronUp, ChevronDown, Loader2, Plus, Edit, Trash2, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function AllEvents() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ASC" });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ... keep existing useEffect, handleSort, filteredData, handleEdit, handleDelete, formatDate, formatProgress functions ...

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


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 ring-1 ring-green-600/20';
      case 'in progress':
        return 'bg-gray-100 text-pink-800 ring-1 ring-yellow-600/20';
      case 'pending':
        return 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20';
      case 'cancelled':
        return 'bg-red-100 text-red-800 ring-1 ring-red-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20';
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
    { key: 'eventManager', label: 'Event Manager ID' },
    { key: 'actions', label: 'Actions' },
  ];

  return (
    <>
      <Sidebar />
      <div className="p-1 my-6 sm:ml-64">
        <div className="flex flex-col min-h-screen bg-gray-50">
          <header className="shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-center text-white">
                All Events
              </h1>
            </div>
          </header>

          <main className="container flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl"
            >
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 p-4 border-b border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => router.push('/event/addevent')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
                <button
                  onClick={() => router.push('/emanager/editAllUsers')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </button>
                <button
                  onClick={() => router.push('/emanager/deleteusers')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </button>
              </div>

              {/* Search Input */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full px-4 py-2.5 pl-10 text-sm bg-dark-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-12"
                  >
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </motion.div>
                ) : filteredData.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center text-gray-500"
                  >
                    <div className="mb-4">
                      <Search className="w-12 h-12 mx-auto text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">No events found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                  </motion.div>
                ) : (
                  <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            scope="col"
                            className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase transition-colors duration-150 cursor-pointer hover:bg-gray-100"
                            onClick={() => column.key !== 'actions' && handleSort(column.key)}
                          >
                            <div className="flex items-center">
                              {column.label}
                              {sortConfig.key === column.key && (
                                sortConfig.direction === 'ASC'
                                  ? <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
                                  : <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {filteredData.map((event, index) => (
                          <motion.tr
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="transition-colors duration-150 hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{event.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{event.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 line-clamp-2">{event.description}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {formatDate(event.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{event.progressNote}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-1">
                                <span className="text-sm text-gray-600">
                                  {formatProgress(event.progress)}
                                </span>
                                <div className="w-full h-2 bg-gray-200 rounded-full">
                                  <div
                                    className="h-2 transition-all duration-500 ease-out bg-blue-600 rounded-full"
                                    style={{ width: `${event.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {event.totalVolunteers}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {event.totalDocuments}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                              ID: {event.eventManager?.id || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleEdit(event.id)}
                                  className="text-blue-600 transition-colors duration-150 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="text-red-600 transition-colors duration-150 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default withAuthProtection(AllEvents);