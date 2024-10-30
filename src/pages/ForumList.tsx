import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllForums } from "../database/data";
import { Forum } from "../types";

export default function ForumsListPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForums() {
      try {
        const forumsData = await getAllForums();
        setForums(forumsData);
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchForums();
  }, []);

  if (loading) return <p>Loading forums...</p>;

  return (
    <div className="mx-auto min-h-screen max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Forums</h1>
      <div className="space-y-4">
        {forums.map((forum) => (
          <Link
            to={`/forum/${forum.name}`}
            key={forum.id}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {forum.name}
            </h2>
            <p className="text-sm text-gray-600">{forum.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
