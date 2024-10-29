import { useState } from "react";
import SearchBox from "../components/SearchBox";
import { posts as initialPosts } from "../database/postData";

type Reply = {
  timestamp: string;
  author: string;
  content: string;
  likes: number;
};

type Post = {
  id: number;
  title: string;
  replies: Reply[];
  likes: number;
  tags: string[];
};

export default function ForumPage() {
  const [posts] = useState<Post[]>(initialPosts);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // Filter posts based on search query and selected tags
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      post.tags.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <div className="feedback-posts-container p-4">
      <h2 className="mb-4 text-2xl font-bold">CSSE Feedback Forum</h2>

      {/* Search Box */}
      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      {/* Tag Filter */}
      <div className="mb-6 mt-4">
        <h4 className="mb-2 font-semibold">Filter by Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Display Filtered Posts */}
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="post mb-6 rounded-lg border border-gray-300 p-4 shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <span className="text-sm text-gray-500">{post.likes} likes</span>
          </div>

          {/* Tags */}
          <div className="tags mb-2 mt-1 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="tag inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Replies */}
          <div className="replies ml-4 mt-2">
            {post.replies.map((reply, index) => (
              <div
                key={index}
                className="reply mb-2 border-l-2 border-blue-500 pl-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    <span className="font-bold">{reply.author}</span> &bull;{" "}
                    {reply.timestamp}
                  </p>
                  <span className="text-sm text-gray-500">
                    {reply.likes} likes
                  </span>
                </div>
                {reply.content && (
                  <p className="mt-1 text-gray-700">{reply.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
