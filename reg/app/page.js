"use client";

import { useState } from "react";

export default function Home() {
  const [citizenId, setCitizenId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSearch = async () => {
    if (citizenId.length !== 13) {
      setError("Citizen ID must be 13 digits.");
      return;
    }
    setLoading(true);
    setError("");
    setStudent(null);
    setConfirmed(false);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizen_id: citizenId }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        if (data.status === "Y") {
          setConfirmed(true);
        }
      } else {
        const err = await response.json();
        setError(err.error || "An error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizen_id: citizenId }),
      });

      if (response.ok) {
        setConfirmed(true);
        setStudent({ ...student, status: "Y" });
      } else {
        const err = await response.json();
        setError(err.error || "An error occurred during confirmation.");
      }
    } catch (err) {
      setError("Failed to connect to the server for confirmation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Student Identity Verification
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={citizenId}
            onChange={(e) =>
              setCitizenId(e.target.value.replace(/\D/g, ""))
            }
            maxLength="13"
            className="w-full rounded-md border border-zinc-300 p-3 text-black focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            placeholder="Enter 13-digit Citizen ID"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || citizenId.length !== 13}
          className="w-full rounded-md bg-blue-600 px-5 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {error && (
          <p className="mt-4 text-center text-red-500">{error}</p>
        )}

        {student && (
          <div className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-700">
            <p className="text-lg font-semibold text-zinc-800 dark:text-white">
              {student.fname} {student.lname}
            </p>
            {confirmed ? (
              <p className="mt-2 font-medium text-green-600 dark:text-green-400">
                Status: Confirmed
              </p>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="mt-4 w-full rounded-md bg-green-600 px-5 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {loading ? "Confirming..." : "Confirm Identity"}
              </button>
            )}
          </div>
        )}
      </div>
      <a
        href="/dashboard"
        className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
      >
        View Dashboard
      </a>
    </div>
  );
}
