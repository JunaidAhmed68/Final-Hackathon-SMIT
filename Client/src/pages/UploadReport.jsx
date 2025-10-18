import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Backend URL
  const SERVER_URL = "http://localhost:3000"; // change when deployed

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview("");
    }
  };

  // ✅ Upload File to Cloudinary
  const uploadFileToCloudinary = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reports");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dbqf9udic/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // ✅ Send File URL to Backend for Gemini Analysis
  const handleAnalyze = async () => {
    if (!file) return toast.error("Please upload a report first!");

    try {
      setLoading(true);
      toast.info("Uploading report...");

      const fileUrl = await uploadFileToCloudinary();

      toast.info("Analyzing with Gemini AI...");

      const res = await axios.post(`${SERVER_URL}/ai/analyze`, {
        fileUrl,
        fileType: file.type,
        userId: "test-user",
      });

      setAiSummary(res.data.data.summary);
      toast.success("AI summary generated!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <ToastContainer position="top-right" />
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
          💚 HealthMate – Upload Medical Report
        </h2>

        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 w-full rounded mb-4"
        />

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg max-h-60 mx-auto"
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Analyzing..." : "Analyze Report with Gemini AI"}
        </button>

        {aiSummary && (
          <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🧠 AI Summary:
            </h3>
            <pre className="whitespace-pre-wrap text-gray-700">
              {aiSummary}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
