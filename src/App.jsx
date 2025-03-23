import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaShare, FaTrash, FaRocket } from "react-icons/fa";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    likes: 0,
    comments: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/Blog/")
      .then((response) => {
        console.log("Fetched blogs:", response.data); // Debugging log
        setBlogs(response.data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleLike = (id) => {
    setBlogs(
      blogs.map((blog) =>
        blog._id === id ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/Blog/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleCreateBlog = async () => {
    console.log("Submitting blog:", newBlog); // Debugging log
    console.log(newBlog);

    if (
      !newBlog.title.trim() ||
      !newBlog.content.trim() ||
      !newBlog.author.trim() ||
      !newBlog.category.trim()
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/Blog/",
        newBlog
      );
      console.log("Blog Created:", response.data); // Debugging log

      setBlogs([...blogs, response.data]);
      setShowCreateModal(false);
      setNewBlog({
        title: "",
        content: "",
        author: "",
        category: "",
        likes: 0,
        comments: "",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Check console for errors.");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <header className="flex items-center gap-2 text-4xl font-bold mb-6">
        <FaRocket className="text-purple-400" /> Blog Sphere
      </header>

      <button
        onClick={() => setShowCreateModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        ➕ Create Blog
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              Create New Blog
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 mb-2 w-full text-black"
              value={newBlog.title} // Ensures controlled component
              onChange={(e) =>
                setNewBlog({ ...newBlog, title: e.target.value })
              }
            />

            <textarea
              placeholder="Content"
              className="border border-gray-700 p-3 mb-2 w-full bg-gray-900 text-white rounded-md"
              value={newBlog.content}
              onChange={(e) =>
                setNewBlog({ ...newBlog, content: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              placeholder="Author"
              className="border border-gray-700 p-3 mb-2 w-full bg-gray-900 text-white rounded-md"
              value={newBlog.author}
              onChange={(e) =>
                setNewBlog({ ...newBlog, author: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="border border-gray-700 p-3 mb-2 w-full bg-gray-900 text-white rounded-md"
              value={newBlog.category}
              onChange={(e) =>
                setNewBlog({ ...newBlog, category: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCreateBlog}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                ✅ Submit
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-purple-400">{blog.title}</h2>
            <p className="text-gray-300 mt-2">{blog.content}</p>
            <p className="mt-2 text-sm text-gray-400">
              By {blog.author} 📌 {blog.category}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleLike(blog._id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
              >
                <FaHeart /> {blog.likes} Likes
              </button>
              <button className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition">
                <FaComment /> Comment
              </button>
              <button className="flex items-center gap-1 text-green-400 hover:text-green-500 transition">
                <FaShare /> Share
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
