import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetailsById } from "../database/db";
import { Post } from "../types";
import { formatDate } from "../utils/dateUtils";

type ReplyDetails = {
  timestamp: string;
  author: string;
  likes: number;
  content: string;
};

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post<ReplyDetails> | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPostDetailsById(Number(postId)).then((postDetails) => {
        setPost(postDetails);
      });
    }
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-page-container p-4">
      <div className="post mb-6 rounded-lg border border-gray-300 p-6 shadow">
        <h2 className="mb-4 text-3xl font-bold">{post.title}</h2>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-500">{post.likes} likes</span>
        </div>

        {/* Tags */}
        <div className="tags mb-6 flex flex-wrap gap-2">
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
        <h3 className="mb-2 text-xl font-semibold">Replies</h3>
        <div className="replies ml-4 mt-2">
          {post.replies.map((reply, index) => (
            <div
              key={index}
              className="reply mb-4 rounded-lg border-l-4 border-blue-500 pl-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-bold">{reply.author}</span> &bull;{" "}
                  {formatDate(new Date(reply.timestamp))}
                </p>
                <span className="text-sm text-gray-500">
                  {reply.likes} likes
                </span>
              </div>
              <p className="mt-2 text-gray-700">{reply.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
