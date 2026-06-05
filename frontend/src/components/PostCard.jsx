import { useState } from "react";

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://social-post-backend.onrender.com/api/posts/${post.id}/comments`,{        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Failed to add comment");
        return;
      }

      // backend returns updated post including comments
      setComments(data?.comments || []);
      setComment("");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.profilePic}
          alt="profile"
          className="avatar"
        />

        <div>
          <h4>{post.username}</h4>
          <small>{post.createdAt}</small>
        </div>
      </div>

      <p>{post.text}</p>

      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
        />
      )}

      <div className="actions">
        <button onClick={handleLike}>
          ❤️ {likes}
        </button>

        <button>
          💬 {comments.length}
        </button>
      </div>

      <div className="comment-section">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={addComment}>
          Add
        </button>
      </div>

      {comments.map((c, index) => (
        <div key={index} className="comment">
          <strong>{c.username}</strong>: {c.text}
        </div>
      ))}
    </div>
  );
}

export default PostCard;