import {
  FaRobot,
  FaUserCircle,
  FaCopy,
  FaRedo,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ type, text, time, date, onRegenerate }) {
  const isUser = type === "user";

  const copyAnswer = () => {
    navigator.clipboard.writeText(text);
    toast.success("Answer copied!");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const today = new Date();
    const msgDate = new Date(dateValue);

    if (today.toDateString() === msgDate.toDateString()) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (yesterday.toDateString() === msgDate.toDateString()) {
      return "Yesterday";
    }

    return msgDate.toLocaleDateString();
  };

  return (
    <div
      className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-full h-fit shadow-lg">
          <FaRobot className="text-white text-lg" />
        </div>
      )}

      {/* Message */}
      <div
        className={`max-w-3xl rounded-2xl shadow-lg px-5 py-4 transition-all ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
        }`}
      >
        {isUser ? (
          <>
            <h3 className="font-semibold mb-2">👤 You</h3>

            <p className="leading-7 whitespace-pre-wrap">{text}</p>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                🤖 Answer
              </h3>

              <button
                onClick={copyAnswer}
                className="text-gray-500 hover:text-blue-600 transition"
              >
                <FaCopy />
              </button>
            </div>

            {/* Markdown Answer */}
            {/* AI Answer */}

            <div
              className="
              prose
              dark:prose-invert
              max-w-none

              prose-headings:text-blue-600
              prose-headings:font-bold

              prose-p:text-gray-700
              dark:prose-p:text-gray-200

              prose-strong:text-black
              dark:prose-strong:text-white

              prose-code:text-pink-600
              dark:prose-code:text-pink-400

              prose-pre:bg-slate-900
              prose-pre:text-white

              prose-li:marker:text-blue-600

              prose-table:border
              prose-th:border
              prose-td:border
              prose-th:bg-slate-100
              dark:prose-th:bg-slate-700

              prose-a:text-blue-600
              hover:prose-a:text-blue-800

              leading-8
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-6 mt-5 text-gray-500 dark:text-gray-400 flex-wrap">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <FaRedo />
                Regenerate
              </button>

              <button
                onClick={() => toast.success("Thanks for your feedback ❤️")}
                className="hover:text-green-600 transition"
              >
                <FaThumbsUp />
              </button>

              <button
                onClick={() => toast("Feedback received 👍")}
                className="hover:text-red-500 transition"
              >
                <FaThumbsDown />
              </button>
            </div>
          </>
        )}

        {/* Time */}
        <p className="text-xs opacity-60 mt-4">
          {date ? `${formatDate(date)} • ${time}` : time}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="bg-gray-700 p-3 rounded-full h-fit shadow-lg">
          <FaUserCircle className="text-white text-lg" />
        </div>
      )}
    </div>
  );
}

export default Message;
