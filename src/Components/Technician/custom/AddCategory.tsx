interface AddCategoryProps {
  title: string;
  onClick: () => void;
}

const AddCategory = ({ title, onClick }: AddCategoryProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-3 flex items-center gap-1 transition-colors"
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      {title}
    </button>
  );
};

export default AddCategory;
