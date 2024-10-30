import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../database/data";
import { useAuth } from "../hooks/auth";
import { cn } from "../utils/cn";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showIDPopup, setShowIDPopup] = useState(false);

  const { user, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("Both fields are required");
      return;
    }

    if (!/^\d{8}$/.test(userId)) {
      setError("User ID must be 8 digits");
      return;
    }
    const numericUserId = Number(userId);
    const user = await fetchUser(numericUserId);
    if (!user) {
      setError("User does not exist");
      return;
    }
    login(userId);

    navigate("/");

    setError("");
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-primary-blue">
        Login to csmarks
      </h2>
      <form onSubmit={handleLogin} className="space-y-6">
        {/*  ID Input */}
        <div className="relative flex flex-col">
          <label htmlFor="uwaid" className="mb-2 font-bold">
            Your UWA ID:
          </label>
          <input
            id="uwaid"
            type="text"
            value={userId}
            onFocus={() => setShowIDPopup(true)}
            onBlur={() => setShowIDPopup(false)}
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
          <div
            className={cn(
              "absolute left-full top-1/2 ml-5 w-60 -translate-y-1/2 rounded-md bg-white p-4 shadow-md transition-opacity",
              { "opacity-0": !showIDPopup }
            )}
          >
            <p>Use one of these IDs to log in:</p>
            <ul className="list-inside list-disc">
              <li>23152009</li>
              <li>22847284</li>
              <li>28375637</li>
            </ul>
            <p>Any password is fine</p>
          </div>
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
            className="rounded-lg bg-primary-blue px-6 py-3 text-white shadow-md transition-colors hover:bg-primary-blue-dark"
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
