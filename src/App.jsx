import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [toxicityScores, setToxicityScores] = useState(null);
  const [analysisVisible, setAnalysisVisible] = useState(false);

  const labels = {
    toxic: "Toxic",
    identity_hate: "Identity Hate",
    insult: "Insult",
    severely_toxic: "Severely Toxic",
    threat: "Threatening",
    obscene: "Obscene",
  };

  const getAnalysis = async (comment) => {
    // replace url
    const res = await axios.post("http://localhost:5000/api/v1/comment", {
      comment,
    });
    return res;
  };

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
        getAnalysis(comment),
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

      const { data } = await getAnalysis(comment);
      setToxicityScores(data);
      setAnalysisVisible(true);

      // Check if any score is above 0.7 and prevent posting
      const isToxic = Object.values(data).some((score) => score > 0.7);

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
    <main className="h-screen flex flex-col">
      <div className="w-full bg-[#1a1a1a] py-4 px-6 flex items-center justify-between shadow-md">
        <h1 className="text-white text-xl font-bold font-inter">
          Profanity Detection and Mitigation using Sentiment Analysis (Demo)
        </h1>
        <button
          onClick={() => setShowHelp(true)}
          className="text-white hover:text-gray-300"
        >
          <i className="fa-solid fa-circle-question text-xl"></i>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#212121] text-white font-inter overflow-hidden">
        <Toaster />

        {/* Main Container */}
        <div className="flex flex-wrap lg:flex-nowrap lg:w-3/4 w-full gap-8 p-4">
          {/* Image Section */}
          <div className="flex-1 bg-gray-700 rounded-md overflow-hidden">
            <img
              src={"/assets/post.jpg"}
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
            {analysisVisible && toxicityScores && (
              <div className="bg-[#2f2f2f] text-white p-4 mt-4 rounded-md shadow-lg w-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">⚠️ Toxicity Analysis</p>
                  <button
                    onClick={() => setAnalysisVisible(false)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Close
                  </button>
                </div>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {Object.entries(toxicityScores)
                    .filter(([_, value]) => typeof value === "number")
                    .map(([key, value]) => (
                      <li key={key}>
                        {labels[key] || key}: {(value * 100).toFixed(1)}%
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#2f2f2f] text-white p-6 rounded-lg w-11/12 max-w-md">
              <h2 className="text-xl font-bold mb-4">🤖 How It Works</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Type your comment in the box below the post.</li>
                <li>The comment is analyzed for toxicity.</li>
                <li>
                  If any score exceeds <b>50%</b>, the comment is flagged and
                  not posted.
                </li>
                <li>You’ll still see the breakdown of scores.</li>
                <li>Keep it kind and respectful! ✨</li>
              </ul>
              <button
                autoFocus
                onClick={() => setShowHelp(false)}
                className="mt-5 bg-white text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
