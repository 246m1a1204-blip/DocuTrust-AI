import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

function UploadCard({ setFileName, setRecentFiles }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);

      // Current File
      setFileName(file.name);

      // Recent Uploads
      setRecentFiles((prev) => {
        if (prev.includes(file.name)) {
          return prev;
        }

        return [file.name, ...prev].slice(0, 6);
      });

      setUploaded(true);

      toast.success("PDF uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-8 transition-all">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-slate-800"
            : "border-gray-300 dark:border-slate-700 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-800"
        }`}
      >
        <input {...getInputProps()} />

        <FaCloudUploadAlt className="text-6xl text-blue-600 mx-auto mb-5" />

        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
          Upload Your PDF
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-3">
          Drag & Drop your PDF here or click to browse.
        </p>

        {uploading && (
          <div className="mt-6">
            <p className="text-blue-600 font-semibold">Uploading...</p>
          </div>
        )}

        {uploaded && !uploading && (
          <div className="mt-6 flex justify-center items-center gap-3 text-green-600 dark:text-green-400">
            <FaFilePdf className="text-2xl" />
            <span className="font-semibold">PDF Uploaded Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadCard;
