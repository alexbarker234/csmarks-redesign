import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { getAllForums } from "../database/data";
import { Forum } from "../types";

export default function ForumsListPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredForums = forums.filter(
    (forum) =>
      forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading forums...</p>;

  return (
    <div className="mx-auto min-h-screen max-w-4xl p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Forums</h1>

      {/* Search Box */}
      <div className="mb-6">
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Forum List */}
      <div className="space-y-4">
        {filteredForums.map((forum) => (
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

      {/* Message if No Forums Found */}
      {filteredForums.length === 0 && (
        <p className="text-center text-gray-500">
          No forums match your search.
        </p>
      )}
    </div>
  );
}
