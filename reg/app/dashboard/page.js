"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [confirmedStudents, setConfirmedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial list of confirmed students
    const fetchConfirmedStudents = async () => {
      try {
        const response = await fetch('/api/confirmed');
        if (response.ok) {
          const data = await response.json();
          setConfirmedStudents(data);
        }
      } catch (error) {
        console.error("Failed to fetch confirmed students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedStudents();

    // Set up WebSocket for real-time updates
    const socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_confirmation') {
        fetchConfirmedStudents();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-100 p-8 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-white">
          Confirmed Student Dashboard
        </h1>
        {loading ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-zinc-200 dark:border-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-700">
                <tr>
                  <th className="border-b border-zinc-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-600 dark:text-zinc-300">
                    major
                  </th>
                  <th className="border-b border-zinc-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-600 dark:text-zinc-300">
                    จำนวนทั้งหมด
                  </th>
                    <th className="border-b border-zinc-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-600 dark:text-zinc-300">
                    ยืนยันแล้ว
                    </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-800">
                {confirmedStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                      {student.major}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-300">
                      {student.total}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-300">
                        {student.regis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
         <a href="/" className="mt-4 text-blue-600 hover:underline dark:text-blue-400">
        Go to Registration
      </a>
      </div>
    </div>
  );
}
