const Histogram = ({ histogram }) => {
  const total = Object.values(histogram).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = histogram[stars] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-sm font-medium w-6">{stars}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Histogram;
