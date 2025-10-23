const RatingBadge = ({ badge }) => {
  if (!badge) return null;

  const colors = {
    Rising: "bg-blue-100 text-blue-800",
    Reliable: "bg-green-100 text-green-800",
    Trusted: "bg-purple-100 text-purple-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[badge] || "bg-gray-100 text-gray-800"}`}>
      {badge}
    </span>
  );
};

export default RatingBadge;
