import { useState } from "react";
import { motion } from "framer-motion";
import StarWidget from "../Ratings/StarWidget.jsx";

const RateCollectorModal = ({ isOpen, onClose, collectorName, donationId, collectorId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setLoading(true);
    try {
      await onSubmit({ donationId, collectorId, rating, comment: comment.trim() || undefined });
      onClose();
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
      >
        <h2 className="text-xl font-semibold mb-4">How was your pickup with {collectorName}?</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <StarWidget rating={rating} onChange={setRating} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Was the pickup on time? Helpful? Any notes?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
            maxLength={400}
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/400</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RateCollectorModal;
