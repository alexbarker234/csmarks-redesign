import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { CiWarning } from "react-icons/ci";
import { FaEllipsisH, FaShare, FaThumbsUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchPostDetailsById } from "../database/data";
import { useBreadcrumb } from "../hooks/breadcrumb";
import { Post, ReplyDetails } from "../types";
import { formatDate } from "../utils/dateUtils";

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post<ReplyDetails> | null>(null);
  const { customTitles, setCustomTitle } = useBreadcrumb();

  useEffect(() => {
    if (!customTitles[`/forums/help1003/${postId}`]) {
      setCustomTitle(`/forums/help1003/${postId}`, "Post");
    }
  }, []);

  useEffect(() => {
    if (postId) {
      fetchPostDetailsById(Number(postId)).then((postDetails) => {
        setPost(postDetails);
        if (postDetails)
          setCustomTitle(`/forums/help1003/${postId}`, postDetails.title);
      });
    }
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-6 rounded-lg border border-gray-300 p-6 shadow">
        <h2 className="mb-4 text-3xl font-bold">{post.title}</h2>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-500">{post.likes} likes</span>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Replies */}
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Replies</h3>
        <div className="space-y-6">
          {post.replies.map((reply, index) => (
            <Reply key={index} reply={reply} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Reply({ reply }: { reply: ReplyDetails }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const role: string = "Student";

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleReport = () => {
    alert("Report submitted");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex items-start space-x-4 border-b border-gray-200 py-4">
      {/* Profile Picture */}
      <img
        src="/placeholder.png"
        alt="Profile placeholder"
        className="h-10 w-10 rounded-md bg-gray-200"
      />

      <div className="flex-1">
        {/* Author and Role */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold text-gray-800">{reply.author}</p>
          <span className="text-xs text-gray-500">{role}</span>
          {role === "Unit Coordinator" && (
            <AiOutlineCheckCircle className="text-green-500" />
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500">
          {formatDate(new Date(reply.timestamp))}
        </p>

        {/* Content */}
        <p className="mt-2 text-sm text-gray-800">{reply.content}</p>

        {/* Actions */}
        <div className="mt-3 flex items-center space-x-6 text-gray-400">
          <div className="flex cursor-pointer items-center space-x-1 transition-colors hover:text-primary-blue">
            <FaThumbsUp />
            <span className="text-sm">{reply.likes}</span>
          </div>
          <div className="flex cursor-pointer items-center space-x-1 transition-colors hover:text-primary-blue">
            <FaShare />
          </div>
        </div>
      </div>

      {/* Options Button with Dropdown */}
      <div className="relative">
        <FaEllipsisH
          className="cursor-pointer text-gray-500"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={handleReport}
              className="flex w-full items-center gap-1 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            >
              <CiWarning size={16} /> Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
