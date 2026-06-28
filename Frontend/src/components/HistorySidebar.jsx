import { useState } from "react";
import { FaSearch, FaTrash, FaFilePdf, FaHistory } from "react-icons/fa";

function HistorySidebar({ chats, onSelect, setHistory, recentFiles = [] }) {
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.question.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteChat = (index) => {
    const updated = chats.filter((_, i) => i !== index);
    setHistory(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-5 h-[760px] overflow-y-auto border border-gray-200 dark:border-slate-700">
      {/* Heading */}

      <div className="flex items-center gap-3 mb-5">
        <FaHistory className="text-blue-600 text-xl" />

        <h2 className="text-xl font-bold dark:text-white">Chat History</h2>
      </div>

      {/* Search */}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search chats..."
        className="w-full mb-5 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Recent Uploads */}

      <div className="mb-6">
        <h3 className="font-semibold mb-3 dark:text-white">
          📂 Recent Uploads
        </h3>

        {recentFiles.length === 0 ? (
          <p className="text-sm text-gray-500">No uploaded files</p>
        ) : (
          recentFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 mb-2"
            >
              <FaFilePdf className="text-red-500" />

              <span className="text-sm dark:text-white truncate">{file}</span>
            </div>
          ))
        )}
      </div>

      {/* Chat Count */}

      <p className="text-gray-500 text-sm mb-4">
        Total Chats : {filteredChats.length}
      </p>

      {/* Chats */}

      {filteredChats.length === 0 ? (
        <p className="text-gray-500">No Chats Found</p>
      ) : (
        filteredChats.map((chat, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-slate-700 transition hover:shadow-lg"
          >
            <h3 className="font-semibold line-clamp-2 dark:text-white">
              {chat.question}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {chat.answer}
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => onSelect(chat)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaSearch />
                Source
              </button>

              <button
                onClick={() => deleteChat(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HistorySidebar;
