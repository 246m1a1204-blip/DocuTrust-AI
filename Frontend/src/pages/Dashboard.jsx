import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UploadCard from "../components/UploadCard";
import ChatBox from "../components/ChatBox";
import HistorySidebar from "../components/HistorySidebar";
import SourceModal from "../components/SourceModal";
import API from "../services/api";
function Dashboard() {
  // Conversation Sessions
  const [sessions, setSessions] = useState([
    {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      history: [],
      fileName: "",
    },
  ]);

  useEffect(() => {
    loadDocuments();
  }, []);
  // Current Active Session
  const [currentSession, setCurrentSession] = useState(0);

  // Recent Uploaded PDFs
  const [recentFiles, setRecentFiles] = useState([]);

  // Source Modal
  const [selectedChat, setSelectedChat] = useState(null);

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Active Session
  const activeSession = sessions[currentSession];

  // Update Messages
  const updateMessages = (value) => {
    setSessions((prev) => {
      const updated = [...prev];

      updated[currentSession].messages =
        typeof value === "function"
          ? value(updated[currentSession].messages)
          : value;

      return updated;
    });
  };

  // Update History
  const updateHistory = (value) => {
    setSessions((prev) => {
      const updated = [...prev];

      updated[currentSession].history =
        typeof value === "function"
          ? value(updated[currentSession].history)
          : value;

      return updated;
    });
  };

  // Update File
  const updateFile = (name) => {
    const updated = [...sessions];
    updated[currentSession].fileName = name;
    setSessions(updated);
  };
  const loadDocuments = async () => {
    const token = localStorage.getItem("token");

    const res = await API.get("/documents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRecentFiles(res.data);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-all">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="flex gap-6 p-6">
          {/* Left Sidebar */}

          <Sidebar
            sessions={sessions}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            setSessions={setSessions}
            fileName={activeSession.fileName}
          />

          {/* Center */}

          <div className="flex-1">
            <UploadCard
              setFileName={updateFile}
              setRecentFiles={setRecentFiles}
            />

            <ChatBox
              messages={activeSession.messages}
              setMessages={updateMessages}
              history={activeSession.history}
              setHistory={updateHistory}
              sessions={sessions}
              setSessions={setSessions}
              currentSession={currentSession}
            />
          </div>

          {/* Right Sidebar */}

          <div className="w-80">
            <HistorySidebar
              chats={activeSession.history}
              setHistory={updateHistory}
              onSelect={setSelectedChat}
              recentFiles={recentFiles}
            />
          </div>
        </div>

        <SourceModal
          chat={selectedChat}
          onClose={() => setSelectedChat(null)}
        />
      </div>
    </div>
  );
}

export default Dashboard;
