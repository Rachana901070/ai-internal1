import StarWidget from "./StarWidget.jsx";

const ReviewCard = ({ review }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
            {review.reviewer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{review.reviewer.name}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(review.createdAt)}</p>
          </div>
        </div>
        <StarWidget rating={review.rating} interactive={false} size={16} />
      </div>
      {review.comment && (
        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
      )}
      <p className="text-xs text-gray-500 mt-1">Donation: {review.donation.title}</p>
    </div>
  );
};

export default ReviewCard;
