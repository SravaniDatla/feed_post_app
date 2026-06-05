import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "John",
      profilePic: "https://i.pravatar.cc/150?img=10",
      text: "Welcome to the social feed!",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      likes: 12,
      comments: [],
      createdAt: "Today",
    },
  ]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  useEffect(() => {
    fetch("https://social-post-app-final.onrender.com/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(
            data.map((p) => ({
              id: p._id,
              username: p.user?.name || "",
              profilePic: "https://i.pravatar.cc/150?img=5",
              text: p.content,
              image: p.imageUrl,
              likes: p.likes || 0,
              comments: p.comments || [],
              createdAt: new Date(p.createdAt).toLocaleString(),
            }))
          );
        } else if (data.value) {
          setPosts(
            data.value.map((p) => ({
              id: p._id,
              username: p.user?.name || "",
              profilePic: "https://i.pravatar.cc/150?img=5",
              text: p.content,
              image: p.imageUrl,
              likes: p.likes || 0,
              comments: p.comments || [],
              createdAt: new Date(p.createdAt).toLocaleString(),
            }))
          );
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="feed-container">
        <CreatePost addPost={addPost} />

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

export default Feed;