import { useState, useRef, useEffect } from "react";
import {
  FaPaperPlane,
  FaTrash,
  FaDownload,
  FaMicrophone,
} from "react-icons/fa";
import api from "../services/api";
import Message from "./Message";
import toast from "react-hot-toast";

function ChatBox({
  messages,
  setMessages,
  history,
  setHistory,
  sessions,
  setSessions,
  currentSession,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // -------------------------
  // Voice Input
  // -------------------------
  const startVoice = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition is not supported.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;

      setQuestion(speech);

      // Automatically ask after speaking
      askQuestion(speech);
    };

    recognition.onerror = () => {
      toast.error("Voice recognition failed.");
    };
  };

  // -------------------------
  // Ask Question
  // -------------------------
  const askQuestion = async (customQuestion = null) => {
    const userQuestion = customQuestion || question;

    if (!userQuestion.trim() || loading) return;
    if (!customQuestion) {
      setMessages((prev) => [
        ...prev,
        {
          type: "user",
          text: userQuestion,
          time: getTime(),
          date: new Date().toISOString(),
        },
      ]);
    }

    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ask", {
        question: userQuestion,
      });

      setHistory((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: res.data.answer,
          source: res.data.sources?.[0]?.text,
          page: res.data.sources?.[0]?.page,
        },
      ]);

      setSessions((prev) => {
        const updated = [...prev];

        if (updated[currentSession].title === "New Chat") {
          updated[currentSession].title =
            userQuestion.length > 25
              ? userQuestion.substring(0, 25) + "..."
              : userQuestion;
        }

        return updated;
      });

      setLoading(false);

      await typeMessage(res.data.answer);
    } catch (err) {
      console.log(err);

      toast.error("Unable to get answer.");

      setLoading(false);
    }
  };

  const typeMessage = (answer) => {
    return new Promise((resolve) => {
      let index = 0;

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "",

          time: getTime(),
          date: new Date().toISOString(),
        },
      ]);

      const interval = setInterval(() => {
        index++;

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].text = answer.slice(0, index);
          return copy;
        });

        if (index >= answer.length) {
          clearInterval(interval);
          resolve();
        }
      }, 15);
    });
  };
  // -------------------------
  // Regenerate
  // -------------------------
  const regenerateAnswer = () => {
    if (history.length === 0) return;

    const lastQuestion = history[history.length - 1].question;

    askQuestion(lastQuestion);
  };

  // -------------------------
  // Download Chat
  // -------------------------
  const downloadChat = () => {
    if (history.length === 0) {
      toast.error("No chat to download.");
      return;
    }

    let content = "";

    history.forEach((chat, index) => {
      content += `Question ${index + 1}\n`;
      content += chat.question + "\n\n";

      content += "Answer\n";
      content += chat.answer + "\n\n";

      content += "--------------------------------------\n\n";
    });

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "DocuTrust_Chat.txt";

    a.click();

    URL.revokeObjectURL(url);
  };
  // -------------------------
  // Clear Chat
  // -------------------------
  const clearChat = () => {
    setMessages([]);
    setHistory([]);
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 transition-all">
      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">AI Chat</h2>

        <div className="flex gap-4">
          <button
            onClick={downloadChat}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <FaDownload />
            Download
          </button>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <FaTrash />
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}

      <div className="h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center mt-32">
            <h2 className="text-3xl font-bold dark:text-white">👋 Welcome</h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Ask questions about your uploaded PDF using text or voice.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <Message
            key={index}
            type={msg.type}
            text={msg.text}
            time={msg.time}
            date={msg.date}
            onRegenerate={regenerateAnswer}
          />
        ))}

        {loading && (
          <div className="flex gap-3 mb-5">
            <div className="bg-blue-600 p-3 rounded-full text-white">🤖</div>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-5 py-4 animate-pulse dark:text-white">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}

      <div className="flex gap-3 mt-6">
        <button
          disabled={loading}
          onClick={startVoice}
          className={`px-5 rounded-xl transition ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white"
          }`}
        >
          <FaMicrophone />
        </button>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }

            if (e.key === "Escape") {
              setQuestion("");
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={loading}
          onClick={() => askQuestion()}
          className={`px-7 rounded-xl text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "..." : <FaPaperPlane />}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
