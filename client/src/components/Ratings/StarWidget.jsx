import { useState } from "react";

const StarWidget = ({ rating, onChange, interactive = true, size = 24 }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) onChange(value);
  };

  const renderStar = (index) => {
    const value = index + 1;
    const filled = interactive ? (hover || rating) >= value : rating >= value;
    const half = interactive ? (hover || rating) >= value - 0.5 && (hover || rating) < value : rating >= value - 0.5 && rating < value;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(value)}
        onMouseEnter={() => interactive && setHover(value)}
        onMouseLeave={() => interactive && setHover(0)}
        style={{
          background: "none",
          border: "none",
          cursor: interactive ? "pointer" : "default",
          padding: 0,
          margin: 0
        }}
        aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
        disabled={!interactive}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
            fill={filled ? "#fbbf24" : half ? "url(#half)" : "#d1d5db"}
            stroke={filled || half ? "#f59e0b" : "#9ca3af"}
            strokeWidth="1"
          />
          {half && (
            <defs>
              <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
          )}
        </svg>
      </button>
    );
  };

  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </div>
  );
};

export default StarWidget;
