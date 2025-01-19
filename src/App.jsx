import "./App.css";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => {
        if (response.status === 429) {
          console.warn(
            "Rate limit reached. Please wait before making more requests."
          );
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setImage(data[0]);
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const handleCommentSubmit = () => {
    if (comment.trim() === "") {
      toast("Comment cannot be empty.", {
        icon: "🚫",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    if (comment.toLowerCase().includes("flag")) {
      toast("Comment cannot be posted as it is flagged by our system.", {
        icon: "🚫",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      setComments([...comments, comment]);
      toast("Comment posted!", {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
    setComment("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] text-white font-inter">
      <Toaster />

      {/* Main Container */}
      <div className="flex flex-wrap lg:flex-nowrap lg:w-3/4 w-full gap-8 p-4">
        {/* Image Section */}
        <div className="flex-1 bg-gray-700 rounded-md overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt="A cute cat"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-400 p-4">Loading image...</p>
          )}
        </div>

        {/* Comments Section */}
        <div className="flex-1 flex flex-col space-y-4 justify-between">
          {/* Existing Comments */}
          <div className=" rounded-md p-4 space-y-4 max-h-80 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-400">No comments yet. Be the first!</p>
            ) : (
              comments.map((c, index) => (
                <div
                  key={index}
                  className="flex items-center bg-black space-x-3 p-3 rounded-md"
                >
                  <i className="fa-solid fa-user text-gray-400 text-lg"></i>
                  <p className="text-sm text-white">{c}</p>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="bg-[#2F2F2F] text-[#B4B4B4] rounded-md p-3 flex items-center mt-auto">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-grow bg-transparent text-white focus:outline-none ml-3"
              placeholder="Add a comment"
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleCommentSubmit}
              className="ml-3 bg-white text-black font-medium flex items-center justify-center rounded-full p-3 h-10 w-10 hover:bg-black hover:text-white transition-all duration-400 ease-in-out"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
