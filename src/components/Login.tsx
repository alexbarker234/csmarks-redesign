import React, { useState } from "react";
import { useAuth } from "../hooks/auth";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("Both fields are required");
      return;
    }

    login(userId);
    setError("");
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-primary-blue">
        Login to csmarks
      </h2>
      <form onSubmit={handleLogin} className="space-y-6">
        {/*  ID Input */}
        <div className="flex flex-col">
          <label htmlFor="uwaid" className="mb-2 font-bold">
            Your UWA ID:
          </label>
          <input
            id="uwaid"
            type="text"
            value={userId}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only digits or empty
              if (/^\d*$/.test(value)) {
                setUserId(value);
              }
            }}
            className="rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="Enter your UWA ID"
            required
            minLength={8}
            maxLength={8}
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 font-bold">
            Your UWA password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Error message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Buttons */}
        <div>
          <button
            type="submit"
            className="hover:bg-primary-blue-dark rounded-lg bg-primary-blue px-6 py-3 text-white shadow-md transition-colors"
          >
            Login
          </button>
        </div>
      </form>

      {/* Privacy Policy */}
      <p className="mt-4 text-center text-gray-600">
        By logging in, you agree to our{" "}
        <a
          href="https://secure.csse.uwa.edu.au/run/chapter0?opt=Dp"
          className="text-primary-blue underline"
        >
          Privacy policy
        </a>
        .
      </p>
    </div>
  );
}
