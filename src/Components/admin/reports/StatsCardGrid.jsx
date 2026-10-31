import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function StatsCardGrid({
  definitions = [],
  overview,
  loading = false,
  onSelectStatus,
  className = "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
}) {
  if (loading) {
    return (
      <div className={className}>
        {definitions.map((card) => (
          <div
            key={card.key}
            className="h-[142px] animate-pulse rounded-[1.5rem] border border-gray-200 bg-orange-50/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {definitions.map((card) => {
        const Icon = card.icon;
        const value = Number(overview?.[card.key] ?? 0);
        const CardTag = card.isStatus ? "button" : "div";

        return (
          <CardTag
            key={card.key}
            {...(card.isStatus
              ? {
                  type: "button",
                  onClick: () => onSelectStatus?.(card.key),
                  "aria-label": `View ${card.label.toLowerCase()}`,
                }
              : {})}
            className={`group relative flex min-h-[142px] flex-col justify-center rounded-[1.5rem] border border-gray-200 bg-white p-5 text-left transition ${
              card.hoverClass ?? "hover:border-orange-200"
            } ${
              card.isStatus
                ? "cursor-pointer hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                : ""
            }`}
          >
            {card.isStatus ? (
              <ChevronRightIcon className="absolute right-5 top-5 h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
            ) : null}
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl text-white ${
                card.iconClass ?? "bg-orange-500"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {value.toLocaleString()}
            </div>
            <div
              className={`mt-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                card.labelClass ?? "text-orange-600"
              }`}
            >
              {card.label}
            </div>
            {card.description ? (
              <div className="mt-1 text-xs text-gray-500">
                {card.description}
              </div>
            ) : null}
          </CardTag>
        );
      })}
    </div>
  );
}
