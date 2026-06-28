function SourceModal({ chat, onClose }) {
  if (!chat) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[700px] rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">📄 Source</h2>

        <p className="text-blue-600 font-semibold mb-3">Page {chat.page}</p>

        <div className="bg-slate-100 rounded-xl p-4 max-h-[400px] overflow-y-auto">
          {chat.source}
        </div>

        <button
          onClick={onClose}
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SourceModal;
