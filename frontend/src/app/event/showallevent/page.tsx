"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ChevronUpIcon, ChevronDownIcon, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { withAuthProtection } from '@/app/utils/withAuthProtection';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

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

  // ... (keep existing handleEdit and handleDelete functions)

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
              {/* ... (keep existing buttons and search input) ... */}
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
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.id}</td>
                          <td className="px-4 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">{event.name}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.description}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{formatDate(event.date)}</td>
                          <td className="px-4 py-2 text-xs whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              event.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              event.status === 'Pending' ? 'bg-red-500 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.progressNote || 'N/A'}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{formatProgress(event.progress)}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.totalVolunteers}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.totalDocuments}</td>
                          <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                            {event.eventManager ? (
                              <div>
                                <div>ID: {event.eventManager.id}</div>
                                <div>{event.eventManager.name}</div>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-xs whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                                onClick={() => handleEdit(event.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                                onClick={() => handleDelete(event.id)}
                              >
                                Delete
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


// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from "axios";
// import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
// import Sidebar from '@/components/Sidebar/Sidebar';
// import { withAuthProtection } from '@/app/utils/withAuthProtection';
// import { useRouter } from 'next/navigation';
// import { toast, Toaster } from 'react-hot-toast';

// function AllEvents() {
//   const [data, setData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true); // Set loading to true when fetching data
//       try {
//         const response = await axios.get("http://localhost:3000/events/all", {
//           params: {
//             sortBy: sortConfig.key,
//             sortOrder: sortConfig.direction.toUpperCase(),
//           },
//         });
//         setData(response.data.events);
//       } catch (error) {
//         console.error("Error fetching events data:", error);
//         toast.error("Failed to fetch events data."); // Notify the user on error
//       } finally {
//         setLoading(false); // Set loading to false after fetching
//       }
//     };

//     fetchData();
//   }, [sortConfig]);

//   const handleSort = (key) => {
//     setSortConfig((prevConfig) => ({
//       key,
//       direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const filteredData = Array.isArray(data) ? data.filter((event) =>
//     event.id.toString().includes(searchTerm) ||
//     event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.date.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     event.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     event.progressNote.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     event.progress.toString().includes(searchTerm.toLowerCase()) ||
//     event.totalVolunteers.toString().includes(searchTerm.toLowerCase()) ||
//     event.totalDocuments.toString().includes(searchTerm.toLowerCase())
//   ) : [];

//   const handleEdit = (eventId) => {
//     router.push(`/emanager/updateusers/${eventId}`);
//   };

//   const handleDelete = async (eventId) => {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       try {
//         await axios.delete(`http://localhost:3000/events/${eventId}`);
//         setData((prevData) => prevData.filter(event => event.id !== eventId)); // Update the state after deletion
//         toast.success("Event deleted successfully.");
//       } catch (error) {
//         console.error("Error deleting event:", error);
//         toast.error("Failed to delete event.");
//       }
//     }
//   };

//   return (
//     <>
//       <Sidebar />
//       <div className="p-1 my-6 sm:ml-64">
//         <div className="flex flex-col min-h-screen bg-gray-100">
//           <header className="bg-white shadow">
//             <div className="max-w-6xl px-3 py-1 mx-auto sm:px-6 lg:px-8">
//               <h1 className="text-2xl font-bold text-center text-gray-900">All Events</h1>
//             </div>
//           </header>
//           <main className="container flex-grow px-4 py-6 mx-auto sm:px-6 lg:px-8">
//             <div className="overflow-hidden bg-white rounded-lg shadow-md">
//               <div className="flex justify-end p-3 space-x-4">
//                 <button
//                   className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                   onClick={() => router.push('/emanager/adduser')}
//                 >
//                   Add User
//                 </button>
//                 <button
//                   className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-blue-700"
//                   onClick={() => router.push('/emanager/editAllUsers')}
//                 >
//                   Edit User
//                 </button>
//                 <button
//                   className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
//                   onClick={() => router.push('/emanager/deleteusers')}
//                 >
//                   Delete User
//                 </button>
//               </div>
//               <div className="p-1">
//                 <input
//                   type="text"
//                   placeholder="Search by ID, name, or description..."
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="overflow-x-auto">
//                 {loading ? (
//                   <div className="flex justify-center py-4">Loading...</div>
//                 ) : (
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         {["id", "name", "description", "date", "status", "progressNote", "progress", "totalVolunteers", "totalDocuments", "eventManagerId"].map((column) => (
//                           <th
//                             key={column}
//                             scope="col"
//                             className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
//                             onClick={() => column !== 'actions' && handleSort(column)}
//                           >
//                             {column.charAt(0).toUpperCase() + column.slice(1)}
//                             {sortConfig.key === column && (
//                               sortConfig.direction === 'asc'
//                                 ? <ChevronUpIcon className="inline w-3 h-3 ml-1" />
//                                 : <ChevronDownIcon className="inline w-3 h-3 ml-1" />
//                             )}
//                           </th>
//                         ))}
//                         <th scope="col" className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {filteredData.map((event, index) => (
//                         <tr key={event.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.id}</td>
//                           <td className="px-4 py-2 text-xs font-medium text-gray-900 whitespace-nowrap">{event.name}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.description}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.date}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.status}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.progressNote}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{JSON.stringify(event.progress)}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.totalVolunteers}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.totalDocuments}</td>
//                           <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">{event.eventManager?.id}</td>
//                           <td className="px-4 py-2 text-xs whitespace-nowrap">
//                             <button onClick={() => handleEdit(event.id)} className="text-blue-600 hover:underline">Edit</button>
//                             <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:underline">Delete</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//       <Toaster />
//     </>
//   );
// }

// export default withAuthProtection(AllEvents);
