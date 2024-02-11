export const BetaBadge = () => {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
      <svg
        className="h-1.5 w-1.5 fill-yellow-500"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      BETA
    </span>
  );
};
