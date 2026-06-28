import {
  FaPlus,
  FaComments,
  FaTrash,
  FaFilePdf,
  FaFolderOpen,
} from "react-icons/fa";

function Sidebar({
  sessions,
  currentSession,
  setCurrentSession,
  setSessions,
  fileName,
}) {
  // Create New Chat
  const createNewChat = () => {
    const newSession = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
      history: [],
      fileName: "",
    };

    setSessions((prev) => {
      const updated = [...prev, newSession];
      setCurrentSession(updated.length - 1);
      return updated;
    });
  };

  // Delete Chat
  const deleteChat = (index) => {
    if (sessions.length === 1) return;

    const updated = sessions.filter((_, i) => i !== index);

    setSessions(updated);

    if (currentSession >= updated.length) {
      setCurrentSession(updated.length - 1);
    } else if (currentSession === index) {
      setCurrentSession(0);
    }
  };

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 border border-gray-200 dark:border-slate-700 transition-all">
      {/* New Chat */}

      <button
        onClick={createNewChat}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 flex justify-center items-center gap-3 font-semibold transition"
      >
        <FaPlus />
        New Chat
      </button>

      {/* Conversations */}

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <FaComments className="text-blue-600" />

          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Conversations
          </h2>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {sessions.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => setCurrentSession(index)}
              className={`group cursor-pointer rounded-xl p-4 transition flex justify-between items-center ${
                currentSession === index
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <div className="overflow-hidden">
                <h3 className="font-semibold truncate">{chat.title}</h3>

                <p
                  className={`text-xs mt-1 ${
                    currentSession === index
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {chat.history.length} Messages
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Document */}

      <div className="mt-10">
        <div className="flex items-center gap-2 mb-3">
          <FaFolderOpen className="text-blue-600" />

          <h2 className="font-bold text-slate-800 dark:text-white">
            Current Document
          </h2>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
          <div className="flex gap-3">
            <FaFilePdf className="text-red-500 mt-1" />

            <div>
              <h3 className="font-semibold dark:text-white">PDF</h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                {fileName || "No PDF Uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}

      <div className="mt-10">
        <div className="bg-green-100 dark:bg-green-900 rounded-xl px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-green-600 text-xl">✅</span>

            <div>
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                AI Ready
              </h3>

              <p className="text-xs text-green-600 dark:text-green-400">
                {sessions.length} Conversation
                {sessions.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
