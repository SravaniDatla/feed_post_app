import { useState } from "react";

function CreatePost({ addPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const handlePost = () => {
    if (!text && !image) {
      alert("Enter text or select an image");
      return;
    }
    const token = localStorage.getItem("token");
    fetch("https://feed-post-app-z0y4.onrender.com/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ content: text, imageUrl: image }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) {
          const user = JSON.parse(localStorage.getItem("user") || "null");
          addPost({
            id: data._id,
            username: user?.name || "",
            profilePic: "https://i.pravatar.cc/150?img=5",
            text: data.content,
            image: data.imageUrl,
            likes: 0,
            comments: data.comments || [],
            createdAt: new Date(data.createdAt).toLocaleString(),
          });
          setText("");
          setImage("");
        } else {
          alert((data && data.message) || "Failed to create post");
        }
      })
      .catch(() => alert("Network error"));
  };

  return (
    <div className="create-post">
      <div className="create-header">
        <img
          src="https://i.pravatar.cc/150?img=5"
          alt="profile"
          className="avatar"
        />

        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="Paste image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button className="post-btn" onClick={handlePost}>
        Post
      </button>
    </div>
  );
}

export default CreatePost;