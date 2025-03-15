import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getCompletion from "./utils/gemini";
import { cleanResponse } from "./utils/helpers";

function App() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleCommentSubmit = async () => {
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

    try {
      toast.promise(
        getCompletion(comment),
        {
          loading: "Posting comment...",
          // success: "Comment posted! 👏",
          error: "Failed to post comment.",
        },
        {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );

      const res = await getCompletion(comment);
      const toxicityScores = cleanResponse(res.choices[0].message.content);

      delete toxicityScores.sentence;

      const labels = {
        toxic: "Toxic",
        identity_hate: "Identity Hate",
        insult: "Insult",
        severely_toxic: "Severely Toxic",
        threat: "Threatening",
        obscene: "Obscene",
      };

      const formattedScores = Object.entries(toxicityScores)
        .map(
          ([key, value]) =>
            `${labels[key] || key}: ${(value * 100).toFixed(1)}%`
        )
        .join("\n");

      // console.log(formattedScores);

      // Show toast message with all toxicity scores
      toast(`Toxicity Analysis:\n${formattedScores}`, {
        icon: "⚠️",
        duration: 6000,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          whiteSpace: "pre-line",
        },
      });

      // Check if any score is above 0.7 and prevent posting
      const isToxic = Object.values(toxicityScores).some(
        (score) => score > 0.7
      );
      if (isToxic) {
        toast("Comment blocked due to high toxicity levels.", {
          icon: "🚫",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      setComments((prev) => [...prev, comment]);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setComment("");
    }
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
          <img
            src={"../public/post.jpg"}
            alt="A cute cat"
            className="w-full h-full object-cover"
          />
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
