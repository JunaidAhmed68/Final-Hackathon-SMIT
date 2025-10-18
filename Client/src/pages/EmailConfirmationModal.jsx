import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EmailConfirmationModal = ({ email, onVerified, onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    if (!code.trim()) return toast.warn("Enter verification code");

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/confirm-email/verify", {
        email,
        code,
      });
      onVerified();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-gray-600">A verification code has been sent to <strong>{email}</strong></p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full border px-4 py-2 rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
           onClick={handleVerify}
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
