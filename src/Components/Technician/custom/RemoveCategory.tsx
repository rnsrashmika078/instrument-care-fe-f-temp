interface RemoveCategoryProps {
  onClick: () => void;
}

const RemoveCategory = ({ onClick }: RemoveCategoryProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-red-500 hover:text-red-600 text-sm mt-1.5 flex items-center gap-1"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Remove
    </button>
  );
};

export default RemoveCategory;